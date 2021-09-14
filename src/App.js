import React from "react";

import "./App.scss";
import Preview from "./Preview";

import "codemirror/mode/markdown/markdown";
import "./theme-dark.css";

import CodeMirror from "./CodeMirror";

const sample = `
# Henlo worldo!

**bold**
_italics_
~~strike~~
<div id="idName">;-;</div>

\`\`\`ts
const x = 'lul';
function (mlep: string) {
	return "fook" + mlep;
}
\`\`\`
\`\`\`cpp
#include <iostream>

int main() {
	cout << "Henlo World!";
	return 0;
}
\`\`\`
\`\`\`py
import math

print(math.floor(102.111))
\`\`\`
`;

export default function App() {
	return (
		<div className="App">
			<CodeMirror
				value={sample}
				options={{
					mode: "markdown",
					theme: "theme-dark",
					indentUnit: 4,
					indentWithTabs: true,
					tabSize: 4,
					lineWrapping: true,
				}}
				onChange={(value, viewUpdate) => {
					console.log(value);
				}}
			/>
			<Preview value={sample} />
		</div>
	);
}