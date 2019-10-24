/* eslint-disable no-undef */
const createError = require('http-errors');
const express = require('express');
const ngrok = require('ngrok');
const qrcode = require('qrcode')
const fs = require('fs');
const os = require('os');
const osc = require('node-osc');
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
app.use('/tiles', indexRouter);
app.use('/throw', indexRouter);
app.use('/osc', oscRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// open sound control client
const client = new osc.Client('127.0.0.1', osc_portnum);

// for time stamp
require('date-utils');

// socketio settings
io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    let dt = new Date();
    console.log(`message received: ${msg} on ${dt.toFormat("HH24:MI:SS")}`);
    io.send(`${dt.toFormat("HH24:MI:SS")} : message received: ${msg}`);
  });
});
io.of('osc').on('connection', (socket) => {
  socket.on('message', (obj) => {
    console.log('osc: ' + obj);
    obj = JSON.parse(obj)
    let sendObj =  new osc.Message(obj.address);
    sendObj.append(obj.args);
    client.send(sendObj);
    let dt = new Date();
    io.of('osc').send(`${dt.toFormat("HH24:MI:SS")} : osc message received: ${obj.args}`);
  });
});

http.listen(portnum, () => {
  console.log('server listening. Port:' + portnum);
});

// get local ip addresses
let interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
  for (let k2 in interfaces[k]) {
    let address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
    }
  }
}
console.log(`local ip addresses: ${addresses}`);
console.log(`FOR LOCAL NEWORK PARTICIPANTS`);
qrcode.toString(`http://${addresses[0]}:${portnum}${conf.mode}`, {type: 'terminal'}, (err, str) => {
  console.log(str);
});

// make ngrok tunnel
console.log(`FOR WWW PARTICIPANTS`);
(async () => {
  let url = await ngrok.connect(portnum);
  url += conf.mode;
  console.log('ngrok URL: ' + url);
  qrcode.toString(url, {type: 'terminal'}, (err, str) => {
    console.log(str);
  });
})();

module.exports.app = app;
module.exports.oscclient = client;
