var socketio = io.connect();
var osc = io.connect('/osc');

var oscSend = function(address, msg) {
  obj = {}
  obj.address = address
  obj.args = [msg]
  osc.send(JSON.stringify(obj))
  console.log(`sent ${obj.args} on address: ${obj.address}`)
}

$(function() {
  $('#osc_form').submit(function(){
    oscSend($('#osc_address').val(), $('#osc_msg').val())
    return false;
  });
  osc.on('message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  $('#message_form').submit(function(){
    socketio.send($('#input_msg').val());
    $('#input_msg').val('');
    return false;
  });
  socketio.on('message', function(msg){
    console.log(`received msg: ${msg}`)
    $('#messages').append($('<li>').text(msg));
  });
});

