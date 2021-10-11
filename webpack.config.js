const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  // loaders for css
  module: {
    rules: [
      {
        test: /.scss$/,
        use: [
          'style-loader', // 3. inject styles into DOM
          'css-loader', // 2. turn css into commonjs
          'sass-loader', // 1. turn sass into css
        ],
      },
      { test: /.(svg|ico|png|gif|jpeg)$/, type: 'asset/resource' },
    ],
  },
  // ability to lunch the files on the browser
  devtool: 'inline-source-map',
  devServer: {
    // contentBase: path.resolve(**dirname, "dist"),
    port: 5001,
    open: true,
    hot: true,
  },

  // plugins for html
  plugins: [
    new HtmlWebPackPlugin({
      title: 'main-page',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
}
