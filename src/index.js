import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { BrowserRouter as Router } from "react-router-dom";

import Fb from "./Firebase/firebase-operations";

ReactDOM.render(
	// <Router>
	// 	<App />
	// </Router>,
	<Fb />,
	document.getElementById("root")
);