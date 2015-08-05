var webpack = require('webpack');

module.exports = {
  // webpack options
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server',
    "./index.js"
  ],
  output: {
    path: "build/",
    filename: "bundle.js",
  },

  stats: {
    // Configure the console output
    colors: true,
    modules: false,
    reasons: true
  },
  // stats: false disables the stats output

  module: { loaders: [{loader: 'react-hot'}, { test: /\.jsx?$/, loader: 'jsx?stripTypes' }] },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  storeStatsTo: "webpackStats", // writes the status to a variable named xyz
  // you may use it later in grunt i.e. <%= xyz.hash %>
};