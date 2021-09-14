"use strict";

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
	const mode = env.production ? "production" : "development";
	const watch = !env.production;

	return {
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
		plugins: [
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, "src/views/index.html"),
						to: path.resolve(__dirname, "public/")
					}
				]
			})
		],
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
				},
				{
					test: /\.s?css$/,
					use: [
						"style-loader",
						"css-loader",
						"postcss-loader",
						"sass-loader"
					]
				}
			]
		}
	};
};