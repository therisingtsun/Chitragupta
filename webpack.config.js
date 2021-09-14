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
			target: "web",
			entry: "./src/index.js",
			devServer: {
				static: {
					directory: path.resolve(__dirname, "public")
				},
				compress: true,
				port: 8080,
				hot: true,
			},
			resolve: {
				extensions: ["*", ".js", ".jsx"]
			},
			output: {
				path: path.resolve(__dirname, "public/"),
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
			watch,
			plugins: [
				new MiniCssExtractPlugin({
					filename: "index.css"
				}),
				new CopyPlugin({
					patterns: [
						{
							from: path.resolve(__dirname, "src/views/index.html"),
							to: path.resolve(__dirname, "public/")
						},
						{
							from: path.resolve(__dirname, "src/styles/__compiled/index.css"),
							to: path.resolve(__dirname, "public/")
						}
					],
				})
			],
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