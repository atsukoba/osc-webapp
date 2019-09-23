// set func and color of tiles
$(function() {
  let lists = $("#tiles").children("li");
  for (let i = 0; i < lists.length; i++) {
    lists[i].style.background = "hsl(" + 360 * i / lists.length + ", 100%, 50%)";
  }
});

$("#tiles li").click( function () {
  let address = $(this).find('.address').html();
  let msg = $(this).find('.msg').html();
  oscSend(address, msg);

  $(this).css("border-radius", "calc(100vw/3)");
  $(this).find('.log').html("sending...");

  setInterval(() => {
    $(this).find('.log').html("");
    $(this).css("border-radius", "0");
  }, 1000);
  return false;
});

