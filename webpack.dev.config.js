'use strict';

/**
 * Development-only webpack settings.
 */
const webpack = require('webpack');
const config = require('./webpack.config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

config.mode = "development";
config.devtool = 'cheap-module-eval-source-map';
const entryName = ['main','auth'];
for(var a=0;a<entryName.length;a++){
  if (typeof config.entry[entryName[a]] === 'string') {
    config.entry[entryName[a]] = ['webpack-hot-middleware/client', webpackConfig.entry[entryName[a]]];
  } else {
    config.entry[entryName[a]].unshift('webpack-hot-middleware/client');
  }
}
config.output = {
  path: path.resolve(__dirname, 'views'),
  publicPath: '/',
  filename: '[name].js',
}
// config.entry.unshift('webpack-hot-middleware/client');
config.plugins.push(new BundleAnalyzerPlugin())
config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('development')
  }
}))
config.plugins.push(new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false
}))
module.exports = config;
