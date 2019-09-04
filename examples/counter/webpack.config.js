const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.join(__dirname, 'build'),
    filename: "scripts.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: false,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (/* loader */) => [require('autoprefixer')()],
            },
          },
        ],
      },
    ]
  },
  devServer: {
    port: 9000
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      title: 'Counter App',
      template: path.join(__dirname, '..', 'index.html')
    })
  ]
}