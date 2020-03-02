'use strict';

const config = require('./config/server/express.js');
const express = require('express');
const logger = require('morgan');

const app = new express();

// ## Middleware

app.use(logger('dev'));
// ## Routes
if (config.env === 'dev') {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.dev.config.js');
  // const DashboardPlugin = require('webpack-dashboard/plugin');

  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(webpackConfig);
  // compiler.apply(new DashboardPlugin());
  app.use(webpackDevMiddleware(compiler,{
    logLevel: 'warn', 
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}
/* Ini harus di bawah webpackDevMiddleware ya!!! */
// app.use(express.static(`${__dirname}/public`));
app.get("/auth/*", function(req, res) {
  res.sendFile(__dirname + '/views/auth.html');
});

app.get("/member/*", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/v2/example/*',function(req,res){
  res.sendFile(__dirname + '/views/examplev2.html');
})

app.get('/v2/partner/*',function(req,res){
  res.sendFile(__dirname + '/views/partnerv2.html');
})

app.listen(config.port, () => console.log(`Server running on port ${config.port}...`));
