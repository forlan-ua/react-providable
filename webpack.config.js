const path = require('path');


module.exports = {
  mode: "development",
  entry: "./tests/src/index.tsx",
  output: {
    path: path.join(__dirname, 'tests'),
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
      }
    ]
  }
}