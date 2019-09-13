const createError = require('http-errors');
const express = require('express');
const ngrok = require('ngrok');
const qrcode = require('qrcode')
const fs = require('fs');
const { Client } = require('node-osc');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const oscRouter = require('./routes/osc');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const portnum = conf.ports.webapp;
const osc_portnum = conf.ports.osc;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('htm', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.use('/', indexRouter);
app.use('/demo', indexRouter);
app.use('/osc', oscRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// open sound control client
const client = new Client('127.0.0.1', osc_portnum);

// for time stamp
require('date-utils');

// socketio settings
io.on('connection', (socket) => {
  socket.on('message',function(msg){
    let dt = new Date();
    console.log(`message received: ${msg} on ${dt.toFormat("HH24:MI:SS")}`);
    io.send(`${dt.toFormat("HH24:MI:SS")} : message received: ${msg}`);
  });
});
io.of('osc').on('connection', (socket) => {
  socket.on('message', (obj) => {
    console.log('osc: ' + obj);
    obj = JSON.parse(obj)
    client.send(obj.address, obj.args);
    let dt = new Date();
    io.of('osc').send(`${dt.toFormat("HH24:MI:SS")} : osc message received: ${obj.args}`);
  });
});

http.listen(portnum, () => {
  console.log('server listening. Port:' + portnum);
});

// make ngrok tunnel
(async () => {
  let url = await ngrok.connect(portnum);
  console.log('ngrok URL: ' + url);
  qrcode.toString(url, {type: 'terminal'}, (err, str) => {
    console.log(str);
  });
})();

module.exports.app = app;
module.exports.oscclient = client;
