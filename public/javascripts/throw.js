// p5.js script
// 重力で落下するエージェント（マウスで掴み、勢いをつけて投げられる）

const colorCodes = {
  "white": [255, 255, 255], 
  "cyan": [0, 255, 255],
  "magenta": [255, 0, 255],
  "yellow": [255, 255, 0],
  "red": [255, 0, 0],
  "green": [0, 255, 0]
};

class Bubble {
  constructor() {
    this.alive = true;
    this.width = 100;
    this.height = 100;
    this.colors = ["white", "cyan", "magenta", "yellow", "red", "green"];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    document.getElementById("footer").style.borderColor = `rgb(${colorCodes[this.color].join()})`;
    document.getElementById("msg").style.color = `rgb(${colorCodes[this.color].join()})`;
    this.x = random(width);
    this.y = height - this.height;
    this.vx = 0;
    this.vy = 0;
    this.xArray = [this.x, this.x, this.x, this.x, this.x, this.x];
    this.yArray = [this.y, this.y, this.y, this.y, this.y, this.y];
    this.display();
  }

  move() {
    // update previous points
    this.xArray.shift();
    this.xArray.push(this.x);
    this.yArray.shift();
    this.yArray.push(this.y);

    // drug
    if (mouseIsPressed) {
      this.x = mouseX;
      this.y = mouseY;
    }

    // free fall
    else {
      this.vy += 1.5;
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
    }
    // thrown
    if (this.y < this.height - 1000) {
      this.destroy();
    }
    if (this.x < this.width / 2) {
      this.vx *= -0.5;
      this.x = this.width / 2;
    }
    if (this.x > width - this.width / 2) {
      this.vx *= -0.5;
      this.x = width - this.width / 2;
    }
    if (this.y > height - this.height / 2) {
      this.vy *= -0.5;
      this.y = height - this.height / 2;
    }
  }

  display() {
    background(0);
    // drawing motion
    for (let i = this.xArray.length - 1; i >= 0 ; i--) {
      let alpha = 255 * (i / this.xArray.length);
      stroke(...colorCodes[this.color], alpha);
      fill(...colorCodes[this.color], 10);
      ellipse(this.xArray[i], this.yArray[i], this.width, this.height);
    }
  }

  draw() {
    if (this.alive) {
      this.move();
      this.display();
    }
  }

  changeColor() {
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    document.getElementById("footer").style.borderColor
    document.getElementById("msg").style.color = `rgb(${this.color.join()})`;
  }

  destroy() {
    this.alive = false;
    restoreBubble();
  }
}

const sum = (arr, fn) => {
  if (fn) {
    return sum(arr.map(fn));
  }
  else {
    return arr.reduce(function(prev, current, i, arr) {
      return prev + current;
    });
  }
};
const mean = (arr, fn) => {
  return sum(arr, fn) / arr.length;
};

let bubble;
let pmouseXArray = [0, 0, 0, 0, 0, 0];
let pmouseYArray = [0, 0, 0, 0, 0, 0];

function setup() {
  const canvas = createCanvas(screen.width, document.documentElement.clientHeight - 60);
  canvas.parent("canvas-wrapper");
  strokeWeight(2);
  setShakeThreshold(60);
  bubble = new Bubble();
}

function restoreBubble() {
  // send color and speed
  oscSend("/bubble", [
    bubble.color, 
    bubble.yArray[0] - bubble.yArray[bubble.yArray.length - 2]]);

  document.getElementById("msg").innerText = "Bubble Sent!!";
  console.log("Bubble Respawned!")
  setTimeout(() => {
    bubble = new Bubble();
    document.getElementById("msg").innerText = "Throw the bubble to screen!";
  }, 750);
}

function draw() {
  if (mouseIsPressed) {
    pmouseXArray.shift();
    pmouseXArray.push(pmouseX);
    pmouseYArray.shift();
    pmouseYArray.push(pmouseY);
  }
  bubble.draw();
}

function mousePressed() {
  bubble.vx = 0;
  bubble.vy = 0;
}

function mouseReleased() {
  bubble.vx += (mouseX - mean(pmouseXArray)) * .3;
  bubble.vy += (mouseY - mean(pmouseYArray)) * .3;
}

function deviceShaken() {
  bubble.changeColor();
}
