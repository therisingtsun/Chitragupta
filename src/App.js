import React, { useState, useRef } from "react";

import "./App.scss";
import Preview from "./components/Preview";

import "codemirror/mode/markdown/markdown";
import "./theme-dark.css";

import CodeMirror from "./components/CodeMirror";

import Toolbar from "./components/Toolbar/toolbar";

import {
	checkEmptySpaceSelection,
	selectEnclosingWords,
	checkIfFormatted,
	modifyPostTransformCursorPos,
	cursorPlacementForWordTransform,
	getLengthDifference,
	cursorPlacementForLineTransform,
	setFocusOnEditor,
} from "./components/Toolbar/toolbarFunctions";

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
	const [customTags, setCustomTags] = useState([]);
	const data = useRef();
	const preview = useRef();
	const editorBox = useRef();
	const tag = useRef();

	const changeHandler = (value) => {
		setText(value);
	};

	const tagsChangeHandler = () => {
		let inputTags = tag.current.value;
		let customTagsArray = inputTags
			.trim()
			.split(/\s+/)
			.filter((s) => s.length);
		setCustomTags(customTagsArray);
	};

	function wordTransformer(config) {
		const editor = data.current.editor;
		const cursorPosition = editor.listSelections();

		const nullCheck = checkEmptySpaceSelection(editor);

		if (!nullCheck) {
			editor.setSelections(selectEnclosingWords(editor));
		}

		let prevData = editor.getSelections();
		let changedData = editor
			.getSelections()
			.map((text) => config.transform(text));
		editor.replaceSelections(changedData);

		const isFormatted = checkIfFormatted(
			prevData[0].length,
			changedData[0].length
		);
		console.log("is fromatted ", isFormatted);
		const shiftOfCursor = modifyPostTransformCursorPos(config, isFormatted);
		console.log("shift cursor by ", shiftOfCursor);

		cursorPlacementForWordTransform(
			editor,
			nullCheck,
			cursorPosition,
			shiftOfCursor
		);

		setFocusOnEditor(editor);
	}

	function lineTransformer(config) {
		const editor = data.current.editor;
		const positionOfCursor = editor.getCursor();
		let contentOfLine = editor.getLine(positionOfCursor.line);

		editor.setSelection(
			{
				line: positionOfCursor.line,
				ch: 0,
			},
			{
				line: positionOfCursor.line,
				ch: contentOfLine.length,
			}
		);
		const transformedLine = config.transform(contentOfLine);
		editor.replaceSelection(transformedLine);
		let updatedContentOfLine = editor.getLine(positionOfCursor.line);

		const lengthDifference = getLengthDifference(
			contentOfLine.length,
			updatedContentOfLine.length
		);

		cursorPlacementForLineTransform(
			editor,
			lengthDifference,
			positionOfCursor
		);
		setFocusOnEditor(editor);
	}

	function renderTags() {
		const tagsJSX = customTags.map((element) => {
			return (
				<>
					<div>{"#" + element}</div>
				</>
			);
		});
		return <div className="tagsdisplay-box">{tagsJSX}</div>;
	}

	return (
		<div className="App">
			<div className="note-header">
				<div className="title">Getting Started</div>
				<div className="custom-tags">
					<textarea
						className="tags"
						ref={tag}
						value={customTags.forEach((element) => {
							return element;
						})}
						onChange={() => {
							tagsChangeHandler();
						}}
						placeholder="Enter your tags!"
					/>
				</div>
			</div>
			{renderTags()}
			<div className="toolbar">
				<Toolbar
					wordTransformer={wordTransformer}
					lineTransformer={lineTransformer}
					preview={preview}
					editor={editorBox}
				/>
			</div>
			<div className="note-panel">
				<div className="editor" ref={editorBox}>
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
				</div>
				<div className="preview" ref={preview}>
					<Preview value={text} />
				</div>
			</div>
		</div>
	);
}
