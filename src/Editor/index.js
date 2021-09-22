import React, { useState, useRef } from "react";

import "./index.scss";
import Preview from "./Preview";

import "./MarkdownChitragupta";
import "./CodeMirror/theme-dark.css";

import CodeMirror from "./CodeMirror";
import "codemirror/addon/selection/active-line";
import "codemirror/keymap/sublime";

import Toolbar from "./Toolbar";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../Firebase/firebase-operations";

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

export default function Editor({ user, noteID }) {
	const noteRef = db.collection("notes").doc(noteID);
	const [note, loading, error] = useDocumentData(noteRef);

	const [noteName, setNoteName] = useState(null);
	const [editorText, setEditorText] = useState(sample);
	const [tagString, setTagString] = useState(null);
	const [tags, setTags] = useState([]);

	if (note) {
		if (!noteName) setNoteName(note.name);
		if (!tags.length) setTags(note.tags);
		if (!tagString) setTagString(note.tags.join(" "));
	}

	console.log(note);

	const [previewVisible, setPreviewVisible] = useState(true);

	const CMEditor = useRef(null);

	function onNoteNameChange(e) {
		const n = e.target.value;
		if (n.length <= 256) {
			setNoteName(n);
		}
	};
	function onTagstringChange(e) {
		const t = e.target.value;
		setTagString(t);
		setTags(t.trim().split(/\s+/).filter(s => s.length));
	};
	function onEditorChange(editor) {
		setEditorText(editor.getValue());
	};

	const UI = () => (
		<div className="note-view">
			<div className="note-header">
				<input
					className="title-input"
					value={noteName}
					onChange={onNoteNameChange}
				/>
				<div className="note-tags">
					<input
						className="tags-input"
						value={tagString}
						onChange={onTagstringChange}
					/>
					<div className="tags-list">
						{tags.map((tag, i) => (<div key={i}>#{tag}</div>))}
					</div>
				</div>
			</div>
			<div className="toolbar">
				<Toolbar
					previewReference={[previewVisible, setPreviewVisible]}
					editorReference={CMEditor}
					user={user}
					note={note}
					noteID={noteID}
				/>
			</div>
			<div className="note-panel">
				<div className="note-editor">
					<CodeMirror
						value={editorText}
						options={{
							mode: "markdown-chitragupta",
							styleActiveLine: true,
							theme: "theme-dark",
							indentUnit: 4,
							indentWithTabs: true,
							tabSize: 4,
							lineWrapping: true,
							cursorBlinkRate: 0,
							keyMap: "sublime"
						}}
						onChange={onEditorChange}
						ref={CMEditor}
					/>
				</div>
				<div className={`note-preview ${previewVisible ? "" : "--hidden"}`}>
					<Preview value={editorText} />
				</div>
			</div>
		</div>
	);

	return (
		<>
			{note && UI()}
			{loading && "Loading…"}
			{error && "Error"}
		</>
	);
}