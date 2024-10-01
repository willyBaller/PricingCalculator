const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',  // Entry point for your main.js file
  output: {
    filename: 'bundle.js',  // Output bundle name
    path: path.resolve(__dirname, 'dist'),  // Output directory for production build
    publicPath: '/',  // Serve assets relative to root
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Handle JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // Use Babel to transpile modern JS
          }
        }
      },
      {
        test: /\.css$/,  // Handle CSS files
        use: ['style-loader', 'css-loader'],  // Inject styles into the DOM
      },
      {
        test: /\.(gltf|glb|bin|png|jpg|jpeg|webp)$/i,  // Handle GLTF models, textures, and bin files
        type: 'asset/resource',  // Webpack will copy these files to the dist folder
      },
    ]
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname),  // Serve files from the root directory (for style.css, glTFModels, textures)
      },
      {
        directory: path.join(__dirname, 'src/textures'),  // Serve textures from src/textures
      },
      {
        directory: path.join(__dirname, 'dist'),  // Serve files from dist as well
      }
    ],
    hot: true,  // Hot Module Replacement
    open: true,  // Automatically open the browser
    compress: true,  // Enable gzip compression
    port: 8081,  // Use port 8081 as shown in your error logs
    historyApiFallback: true,  // Ensures index.html is served for SPA
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',  // Reference your index.html file in the root directory
    }),
  ],
  mode: 'development',  // Use 'development' for faster builds with unminified output
};
