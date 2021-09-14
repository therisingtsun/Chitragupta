import * as functions from "firebase-functions";

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";

import express from "express";

import App from "./src/App";

import { readFile } from "fs/promises";
import { resolve } from "path";

const app = express();
app.get("**", (req, res) => {
	readFile(resolve(__dirname, "src/views/index.html"), "utf-8")
		.then(index => {
			const context = {};
			const html = renderToString(
				<Router location={req.originalUrl} context={context}>
					<App />
				</Router>
			);
			index = index.replace("<!-- ::APP:: -->", html);
			res.set("Cache-Control", "public, max-age=600, s-maxage=1200");
			res.send(index);
		});
})

export const ssr = functions.https.onRequest(app);