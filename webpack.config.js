"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
	const mode = env.production ? "production" : "development";
	const watch = !env.production;

	return {
		mode,
		watch,
		entry: "./src/index.js",
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "./src/views/index.html"),
			}),
			new MiniCssExtractPlugin({
				filename: "main.bundle.css"
			})
		],
		resolve: {
			extensions: ["*", ".js", ".jsx"],
			alias: {
				"react": "preact/compat",
				"react-dom": "preact/compat"
			}
		},
		output: {
			path: path.resolve(__dirname, "public/"),
			filename: "[name].bundle.js",
			chunkFilename: "[name].bundle.js",
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/env"
						]
					}
				},
				{
					test: /\.s?css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						// "style-loader",
						"css-loader",
						"postcss-loader",
						"sass-loader"
					]
				}
			]
		}
	};
};