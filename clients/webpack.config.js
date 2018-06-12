const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

console.log(path.resolve(__dirname, 'client.js'),process.env.NODE_ENV)
var plugin = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
]
var devtool = "source-map"
process.env.NODE_ENV = "development"
// if(process.env.NODE_ENV == "development" ){
//   plugin.push(new webpack.HotModuleReplacementPlugin())
//   entry["bundle"].push('webpack-hot-middleware/client')
//   devtool = "source-map";
// }else if(process.env.NODE_ENV == "test" ){
//   devtool = "source-map";
//   process.env.NODE_ENV = "development"
// }else{
//   process.env.NODE_ENV = "production";
  
//   // plugin.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }))
//   plugin.push(new webpack.optimize.OccurrenceOrderPlugin())
//   plugin.push(new webpack.optimize.DedupePlugin())
//     plugin.push(new webpack.LoaderOptionsPlugin({
//     options: {
//       postcss: function () {
//         return [autoprefixer];
//       },
//     }
//   }))

//   plugin.push(new webpack.optimize.UglifyJsPlugin())
// }

console.log("build mode : ",process.env.NODE_ENV)

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

//web config
let web_bundle = path.join(__dirname, "app", "web", 'bin',"bundle.js");
let desktop_bundle = path.join(__dirname ,"app", "desktop", 'bin',"bundle.js");
let script_plugin = new WebpackShellPlugin({});
if(fs.existsSync(web_bundle)){
  script_plugin = new WebpackShellPlugin({
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
    script_plugin
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
  node: {
    __dirname: false,
    __filename: false
  }
}]