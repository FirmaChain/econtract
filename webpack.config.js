const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

let plugin = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
]

let devtool = "source-map"
process.env.NODE_ENV = "development"

console.log("build mode : ", process.env.NODE_ENV)

plugin.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }
}))

let defaults = {
  context: __dirname,
  devtool: devtool,
  mode:process.env.NODE_ENV,
  resolve: {
    extensions: ['*', '.jsx', '.scss', '.js', '.json', '.txt', '.html'],
    modules: [
      path.join(__dirname, "node_modules"),
    ]
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
           presets:['env','react','stage-0'],
           plugins: [
            "transform-decorators-legacy",
          ]
        }
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  devServer: {
    https: true
  },
  plugins: plugin
};

//////////////////////
//////web-config//////
let web_bundle = path.join(__dirname, "app", "web", "bin","bundle.js");
let web_bundle_copy_script_plugin = new WebpackShellPlugin({});

module.exports = [{
  ...defaults,
  entry: { 
    "bundle":['babel-polyfill', './app/web/client.js'],
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
  },
  output: { 
    path: path.join(__dirname, "app", "web", 'bin'),
    filename: '[name].js',
    publicPath: "/"
  },
  plugins: [
    ...plugin,
    web_bundle_copy_script_plugin
  ]
}]