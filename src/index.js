import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import Editor from "./Editor";

import "./index.scss";

ReactDOM.render(
	<Router>
		<App />
		{/* <Editor /> */}
	</Router>,
	document.getElementById("root")
);