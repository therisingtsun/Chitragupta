"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
	const mode = env.production ? "production" : "development";
	const watch = !env.production;

	return [
		{
			mode,
			watch,
			entry: "./src/index.dev.js",
			resolve: {
				extensions: ["*", ".js", ".jsx"]
			},
			output: {
				path: path.resolve(__dirname, "dist/"),
				filename: "index.js"
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
					}
				]
			}
		}, {
			mode,
			plugins: [
				new MiniCssExtractPlugin({
					filename: "index.css"
				}),
				new CopyPlugin({
					patterns: [
						{
							from: path.resolve(__dirname, "src/views/index.html"),
							to: path.resolve(__dirname, "dist/")
						},
						{
							from: path.resolve(__dirname, "src/styles/__compiled/index.css"),
							to: path.resolve(__dirname, "dist/")
						}
					],
				})
			],
			watch,
			entry: "./src/styles/index.scss",
			output: {
				path: path.resolve(__dirname, "src/styles/__compiled/"),
				filename: "index.css.temp"
			},
			resolve: {
				extensions: [".css", ".scss"],
			},
			module: {
				rules: [
					{
						test: /\.s?css$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									importLoaders: 1
								}
							},
							"postcss-loader",
							"sass-loader"
						]
					}
				]
			}
		}
	];
};