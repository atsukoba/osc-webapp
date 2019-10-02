/* eslint-disable no-undef */
var socketio = io.connect();
var osc = io.connect('/osc');

var oscSend = function(address, msg) {
  let obj = {};
  obj.address = address;
  obj.args = msg;
  osc.emit("message", JSON.stringify(obj));
  console.log(`sent ${obj.args} on address: ${obj.address}`);
  return
}

$('#osc_form').submit(function(){
  oscSend($('#osc_address').val(), $('#osc_msg').val());
  return false;
});

osc.on('message', function(msg){
  $('#messages').prepend($('<li>').text(msg));
});

$('#message_form').submit(function(){
  socketio.send($('#input_msg').val());
  $('#input_msg').val('');
  return false;
});

socketio.on('message', function(msg){
  console.log(`received msg: ${msg}`)
  $('#messages').prepend($('<li>').text(msg));
});
