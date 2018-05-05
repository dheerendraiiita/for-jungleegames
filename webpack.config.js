var webpack = require("webpack");
var fs = require('fs');
var publishFiles = require('./publish-files.json');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var webpackModulesConfig = require('./webpack.common.config.json');

var pluginArray = [];


pluginArray.push(new CopyWebpackPlugin(publishFiles));

module.exports = {
    entry: webpackModulesConfig.entry,
    output: webpackModulesConfig.output,
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.jpg$/,
            loader: "file-loader"
        }, {
            test: /\.png$/,
            loader: "url-loader?mimetype=image/png"
        }, {
            test: /\.gif$/,
            loader: "url-loader?mimetype=image/gif"
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.styl$/,
            loader: 'style-loader!css-loader!stylus-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        }]
    },
    plugins: pluginArray
};