# osc-webapp

serve osc from www: simple web OSC controller

## demo

![screenshot](https://i.gyazo.com/d03c2b3f1fdfebd8911ebf6ea8a0475d.png)

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

and share generated qr code/URL to participants

or you may use `servo` to publish your local port to www

```shell
ssh -R 80:localhost:7000 serveo.net
```

## dev

fork this repo and use `demo.ejs` as html template.
