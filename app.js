"use strict";

const config = require("./config/server/express.js");
const express = require("express");
const logger = require("morgan");

const app = new express();

// ## Middleware
switch (config.env) {
  case "development":
  case "dev":
    app.use(logger("dev"));
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.dev.config.js");
    // const DashboardPlugin = require('webpack-dashboard/plugin');
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    var compiler = webpack(webpackConfig);
    // compiler.apply(new DashboardPlugin());
    app.use(
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: webpackConfig.output.publicPath
      })
    );
    app.use(webpackHotMiddleware(compiler));
    break;
  case "production":
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.config.js");
    // const DashboardPlugin = require('webpack-dashboard/plugin');
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    var compiler = webpack(webpackConfig);
    // compiler.apply(new DashboardPlugin());
    app.use(
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: webpackConfig.output.publicPath
      })
    );
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(`${__dirname}/public`));
    break;
}
/* 
    Jika posisinya development
    Ini harus di bawah webpackDevMiddleware ya!!!
    - Routes 
*/
app.get("/auth/*", function(req, res) {
  res.sendFile(__dirname + "/views/auth.html");
});

app.get("/member/*", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/v2/example/*", function(req, res) {
  res.sendFile(__dirname + "/views/examplev2.html");
});

app.get('/v2/partner/*',function(req,res){
  res.sendFile(__dirname + '/views/partnerv2.html');
})

app.listen(config.port, () => console.log(`Server running on port ${config.port}...`));
