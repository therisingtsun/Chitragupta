import React, { useState, useRef } from "react";

import "./App.scss";
import Preview from "./Preview";

import "codemirror/mode/markdown/markdown";
import "./theme-dark.css";

import CodeMirror from "./CodeMirror";

export default function App() {
	const [text, setText] = useState(`
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

`);
	const data = useRef();
	const changeHandler = (value) => {
		setText(value);
	};

	function transformer(config) {
		const editor = data.current.editor;
		const cursorPosition = editor.listSelections();
		console.log("cursor pos ", cursorPosition);

		const nullCheck = checkEmptySpaceSelection(editor);

		if (!nullCheck) {
			editor.setSelections(selectEnclosingWords(editor));
		}

		let prevData = editor.getSelections();
		let changedData = editor
			.getSelections()
			.map((text) => config.transform(text));
		editor.replaceSelections(changedData);

		let formatted = prevData[0].length < changedData[0].length;
		modifyPostTransformCursorPos(config, formatted);

		cursorPlacement(editor, nullCheck, config, cursorPosition);

		setFocusOnEditor(editor);
	}

	function checkEmptySpaceSelection(editor) {
		const cursorPosition = editor.getCursor();
		const check = editor.findWordAt(cursorPosition);

		let nullCheck;
		if (!editor.somethingSelected()) {
			nullCheck =
				cursorPosition.ch === check.anchor.ch ||
				cursorPosition.ch === check.head.ch;
		}
		return nullCheck;
	}

	function selectEnclosingWords(editor) {
		const listSelections = editor.listSelections();
		console.log("list sel", listSelections);
		let selections = [];
		listSelections.forEach((element) => {
			if (element.anchor.ch === element.head.ch) {
				const pos = editor.findWordAt(element.anchor);
				selections.push({
					anchor: {
						ch: pos.anchor.ch,
						line: pos.anchor.line,
					},
					head: {
						ch: pos.head.ch,
						line: pos.head.line,
					},
				});
			}
			selections.push(element);
		});
		return selections;
	}

	function modifyPostTransformCursorPos(config, formatted) {
		config.postTransformCursorPos = formatted
			? config.postTransformCursorPos
			: -config.postTransformCursorPos;
	}

	function cursorPlacement(editor, nullCheck, config, cursorPosition) {
		if (nullCheck) {
			const currentPos = editor.getCursor();

			editor.setCursor(
				currentPos.line,
				currentPos.ch - config.postTransformCursorPos
			);
		} else {
			console.log(cursorPosition);
			let cursorPositions = [];
			cursorPosition.forEach((element) => {
				cursorPositions.push({
					anchor: {
						line: element.anchor.line,
						ch: element.anchor.ch + config.postTransformCursorPos,
					},
					head: {
						line: element.anchor.line,
						ch: element.anchor.ch + config.postTransformCursorPos,
					},
				});
			});
			editor.setSelections(cursorPositions);
		}
	}

	function setFocusOnEditor(editor) {
		if (!editor.hasFocus()) editor.focus();
	}

	const toggleItalics = {
		transform(text) {
			const italicsRegex = /^_((?:.|\r?\n)*?)_$/;
			return italicsRegex.test(text)
				? text.replace(italicsRegex, "$1")
				: `_${text}_`;
		},
		postTransformCursorPos: 1,
	};

	const toggleBold = {
		transform(text) {
			const boldRegex = /^__((?:.|\r?\n)*?)__$/;
			return boldRegex.test(text)
				? text.replace(boldRegex, "$1")
				: `__${text}__`;
		},
		postTransformCursorPos: 2,
	};

	return (
		<div className="App">
			<CodeMirror
				value={text}
				options={{
					mode: "markdown",
					theme: "theme-dark",
					indentUnit: 4,
					indentWithTabs: true,
					tabSize: 4,
					lineWrapping: true,
				}}
				onChange={(value, viewUpdate) => {
					let str = value.getValue();
					changeHandler(str);
				}}
				ref={data}
			/>
			<Preview value={text} />

			<div>
				<button
					onClick={() => {
						transformer(toggleBold);
					}}
				>
					BOLD
				</button>
				<button
					onClick={() => {
						transformer(toggleItalics);
					}}
				>
					ITALIC
				</button>
				<button
					onClick={() => {
						strikethroughText();
					}}
				>
					STRIKETHROUGH
				</button>
			</div>
		</div>
	);
}
