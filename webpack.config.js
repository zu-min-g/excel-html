"use strict"
var path = require("path")
var webpack = require("webpack")
var packageJson = require("./package.json")
var env = process.env.NODE_ENV || "development"
let config = {
  mode: env,
  entry: {
    excelHtml: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist/browser"),
    filename: "[name].js",
    library: "excelHtml",
    libraryTarget: "var",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".webpack.js", ".web.js", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: ["babel-loader"],
        exclude: path.resolve(__dirname, "vendor"),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.BannerPlugin({
      banner: `${packageJson.name} | v${packageJson.version} | ${packageJson.license} License`,
    }),
  ],
  optimization: {
    minimize: false,
  },
  externals: {
    jquery: "jQuery",
  },
}

if (env === "production") {
  config.output.filename = "[name].min.js"
  config.optimization.minimize = true
} else {
  config.devtool = "inline-source-map"
}

module.exports = config
