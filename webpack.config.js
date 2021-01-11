const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  target: 'electron-renderer', // should i use this???
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'build')

  },
  devServer: { overlay: true },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'

      },

      {
        test: /\.node$/,
        loader: 'node-loader',
      },

      { enforce: "pre", exclude: /node_modules/, test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']

      },

      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './index.html'

    })

    // new ErrorOverlayPlugin()
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']

  }
};