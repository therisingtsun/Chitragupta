"use strict";

const path = require("path");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
	const mode = env.production ? "production" : "development";
	const watch = !env.production;

	const plugins = [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "./src/views/index.html"),
		}),
		new MiniCssExtractPlugin({
			filename: "main.bundle.css"
		})
	];

	if (env.production) plugins.push(new Dotenv({
		path: "./firebase-keys.env"
	}));

	return {
		mode,
		watch,
		entry: "./src/index.js",
		plugins,
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
						"css-loader",
						"postcss-loader",
						"sass-loader"
					]
				}
			]
		}
	};
};