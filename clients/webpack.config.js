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
      {test: /\.json$/, use: ["json-loader"]},
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
  plugins: plugin
};

//////////////////////
//////web-config//////
let desktop_public_dir = path.join(__dirname, "app", "desktop", "public");
let desktop_bin_dir = path.join(__dirname, "app", "desktop", "bin");
let web_bundle = path.join(__dirname, "app", "web", "bin","bundle.js");
let desktop_bundle = path.join(desktop_bin_dir, "bundle.js");
let web_bundle_copy_script_plugin = new WebpackShellPlugin({});
if( fs.existsSync(web_bundle) ){
  web_bundle_copy_script_plugin = new WebpackShellPlugin({
    onBuildStart:['echo "Webpack Start"'], 
    onBuildExit:[`cp ${web_bundle} ${desktop_bundle}`]
  })
}

module.exports = [{
  ...defaults,
  entry: { "bundle":['babel-polyfill', './app/web/client.js'] },
  output: { 
    path: path.join(__dirname, "app", "web", 'bin'),
    filename: '[name].js',
    publicPath: "/"
  },
  plugins: [
    ...plugin,
    web_bundle_copy_script_plugin
  ]
},{
  ...defaults,
  target: 'electron-main',
  entry: { "main":['babel-polyfill', './app/desktop/main.js'] },
  output: { 
    path: path.join(__dirname, "app", "desktop", 'bin'),
    filename: '[name].js',
    publicPath: "/"
  },
  plugins:[
    ...plugin,
    new WebpackShellPlugin({
      onBuildStart:['echo "Webpack electron-main Start"'], 
      onBuildExit:[`cp -r ${path.join(desktop_public_dir,"/")} ${path.join(desktop_bin_dir,"/")}`]
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}]