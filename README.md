# osc-webapp

serve osc from www: simple web OSC controller

![ss](https://i.gyazo.com/bc90ec0297a2080c47e2a4c264916a52.png)

## install

- node.js
- npm

```shell
git clone git@github.com:atsukoba/osc-webapp.git
cd osc-webapp
npm install
```

## run

```shell
npm start
```

and share generated qr code/URL of local ip address and ngrok url to participants.

or you may use `servo` to publish your local port to www

```shell
ssh -R 80:localhost:7000 serveo.net
```

## demo : Tiles

![screenshot animation](https://i.gyazo.com/6743bcefe33625d949fd7f1b9ced35a6.gif)

sending osc message by tapping tiles

## demo : Throwing Bubble

![screenshot animation](https://i.gyazo.com/73f170317f31971bd4da5a8680f6634a.gif)

sending osc message by flicking a bubble

### config

changing QR code URL (append them to URL)

- messaging : `"mode": "/"`
- Demo Tiles : `"mode": "/tiles"`
- Demo Throwing : `"mode": "/throw"`

## dev

fork this repo and use `demo.ejs` as html template.
