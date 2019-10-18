// p5.js script
// 重力で落下するエージェント（マウスで掴み、勢いをつけて投げられる）

class Bubble {
  constructor() {
    this.alive = true;
    this.width = 100;
    this.height = 100;
    this.color = [255, 255, 255];
    this.colors = [
      [255, 255, 255],
      [0, 255, 255],
      [255, 0, 255],
      [255, 255, 0]
    ];
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
      this.vy += 1.25;
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
    }
    if (this.x < 0) {
      this.vx *= -0.5;
      this.x = 0;
    }
    if (this.x > width - this.width) {
      this.vx *= -0.5;
      this.x = width - this.width;
    }
    // thrown
    if (this.y < this.height - 1000) {
      this.destroy();
    }
    if (this.y > height - this.height) {
      this.vy *= -0.5;
      this.y = height - this.height;
    }
  }

  display() {
    background(0);
    // drawing motion
    for (let i = this.xArray.length - 1; i >= 0 ; i--) {
      let alpha = 255 - (40 * i);
      stroke(...this.color, alpha);
      fill(...this.color, alpha);
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
    let colorsFrom = this.colors
    colorsFrom.splice(colorsFrom.indexOf(this.color), 1);
    this.color = colorsFrom[Math.floor(Math.random() * colorsFrom.length)];
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
  createCanvas(screen.width, screen.height - 100);
  strokeWeight(2);
  bubble = new Bubble();
}

function restoreBubble() {
  oscSend("bubble", "sent");
  console.log("Bubble Respawned!")
  setTimeout(() => {
    bubble = new Bubble();
  }, 500);
}

function draw() {
  if (mouseIsPressed) {
    pmouseXArray.shift();
    pmouseXArray.push(pmouseX);
    pmouseYArray.shift();
    pmouseYArray.push(pmouseY);
  }
  checkForShake();
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

function checkForShake() {
  accChangeX = abs(accelerationX - pAccelerationX);
  accChangeY = abs(accelerationY - pAccelerationY);
  accChangeT = accChangeX + accChangeY;

  if (accChangeT >= 20) {
    bubble.changeColor();
  }
  else {
    bubble.vx += accChangeX;
    bubble.vy += accChangeY;
  }
}