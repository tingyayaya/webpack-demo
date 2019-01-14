const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

let config = {
  entry: {},
  output: {
    filename: 'js/[name].bundle.[hash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          // 编译后使用什么loader来提取css文件，如下使用 style-loader 来提取
          fallback: 'style-loader',
          // 需要什么样的loader去编译文件，比如如下使用css-loader 去编译文件
          use: [{
            loader: "css-loader"
          },{
            loader: "sass-loader"
          }]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: './images',
          publicPath: '../images'
        }
      },
      {
        test: /\.html$/,
        use:{
          loader: 'html-loader',
          options: {
            attrs: [':data-src', ':src'],
            minimize: true
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        },
        exclude: /node_modeles/
      }
    ]
  },
  plugins: [
    // 详见 https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/#-extract
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename: './css/[name].[hash:5].css',
      allChunks: true
    }),
    // 自动加载模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  optimization: {
    //打包 第三方库
    //打包 公共文件
    splitChunks: {
      cacheGroups: {
        vendor:{//node_modules内的依赖库
            chunks:"all",
            test: /[\\/]node_modules[\\/]/,
            name:"vendor",
            minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
            maxInitialRequests: 5,
            minSize: 0,
            priority:-10,
            // enforce: true?
        },
        common: {
            chunks:"all",
            name: "common", //生成文件名，依据output规则
            minChunks: 2,
            minSize: 0,
            priority: -20
        }
      }
    }
  }

};

/*
 获取项目中多个入口文件
*/
function getEntries(paths) {
  // node 中同步获取文件列表
  var files = glob.sync(paths),
  entries = {};
  
  files.forEach(function(filepath) {
    var toArray = filepath.split('/');
    var filename = toArray[toArray.length-1].replace(/\.js$/, '');
    entries[filename] = filepath;
  });
  return entries;
}

var entries = getEntries('./src/static/js/*.js');


//获取入口文件长度
var entriesLength = Object.keys(entries).length;

/*
 HtmlWebpackPlugin 该插件将为您生成一个 html5文件
 filename: 输出的HTML文件名
 template 模板文件路径
 inject true | 'head' | 'body' | false  设置true或body，所有的js资源文件将被放置到 body元素的底部。
 chunks: 允许添加某些块
 chunksSortMode: 允许控制块在添加页面之前的排序方式
 */

//判断是单入口页面 or 多入口页面
if(entriesLength !== 1){
  Object.keys(entries).forEach(function(name) {
    config.entry[name] = entries[name];
    let htmlPlugin = new HtmlWebpackPlugin({
      filename: `./pages/${name}.html`,
      template: `./src/pages/${name}.html`,
      inject: true,
      chunks: [ name, 'vendor', 'common'],
      chunksSortMode: 'dependency',
    })
    config.plugins.push(htmlPlugin)
  });
}else{

}
module.exports = config;