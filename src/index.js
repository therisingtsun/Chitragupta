import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.scss";

// import Fb from "./firebase-test";

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	// <Fb />,
	document.getElementById("root")
);