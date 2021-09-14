import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.scss";

class App extends Component {
	render() {
		return (
			<Switch>
				<Route path="/test">
					<div className="App">
						<h1> Henlo worldo! </h1>
					</div>
				</Route>
				<Route path="/">
					<div className="App">
						<h1> Henlo… </h1>
					</div>
				</Route>
			</Switch>
		);
	}
}

export default App;