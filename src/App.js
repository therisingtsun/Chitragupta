import React, { useState } from "react";

import "./App.scss";
import Preview from "./Preview";

import "./MarkdownChitragupta";
import "./CodeMirror/theme-dark.css";

import CodeMirror from "./CodeMirror";

const sample = `
# Henlo worldo!

**bold**
_italics_
~~strike~~
<div id="idName">;-;</div>

> Quote

(+) Pro  
(+) Piro

(-) Con

(+) Pro

Normal

(-) Con	

Normal

(+) Multiline
Pro

(-) Multiline
(-) Con

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
	const [text, setText] = useState(sample);
	return (
		<div className="App">
			<CodeMirror
				value={sample}
				options={{
					mode: "markdown-chitragupta",
					theme: "theme-dark",
					indentUnit: 4,
					indentWithTabs: true,
					tabSize: 4,
					lineWrapping: true,
					cursorBlinkRate: 0,
				}}
				onChange={(value, viewUpdate) => {
					setText(value.getValue());
				}}
			/>
			<Preview value={text} />
		</div>
	);
}