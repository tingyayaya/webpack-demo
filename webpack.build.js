const merge = require('webpack-merge');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const base = require('./webpack.base.js');


module.exports = merge(base, {
  mode: "production",
})