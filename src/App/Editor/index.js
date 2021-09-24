import React, { useState, useRef } from "react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/selection/active-line";
import "codemirror/keymap/sublime";

import "./MarkdownChitragupta";
import "./CodeMirror/base.css";
import "./CodeMirror/theme-dark.css";
import CodeMirrorOptions from "./CodeMirror/options";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { db, storage } from "../Firebase/firebase-operations";

import "./index.scss";
import Toolbar from "./Toolbar";
import Preview from "./Preview";

function Editor({ user, note, noteID }) {
	const [noteName, setNoteName] = useState(note.name);
	const [tags, setTags] = useState(note.tags);
	const [tagString, setTagString] = useState(note.tags.join(" "));
	const [editorText, setEditorText] = useState("Loading…");
	
	const editAccess = user.uid === note.author;
	
	const urlRef = storage.ref(`${note.author}/${noteID}.md`);
	const [url, urlLoading, urlError] = useDownloadURL(urlRef);
	const [contentLoaded, setContentLoaded] = useState(false);
	
	if (url && !contentLoaded) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "text";
		xhr.onload = (event) => {
			CMEditor?.current?.editor.setValue(xhr.response);
			setContentLoaded(true);
		};
		xhr.open("GET", url);
		xhr.send();
	}

	const [previewVisible, setPreviewVisible] = useState(true);

	const CMEditor = useRef(null);

	function onNoteNameChange(e) {
		if (editAccess) {
			const n = e.target.value;
			if (n.length <= 256) {
				setNoteName(n);
			}
		}
	}
	function onTagstringChange(e) {
		const t = e.target.value;
		setTagString(t);
		setTags(t.trim().split(/\s+/).filter(s => s.length));
	}
	function onEditorChange(editor, data, value) {
		setEditorText(value);
	}

	if (!editAccess && !note.publicAccess) {
		return "No permissun, sowwies…";
	} else return (
		<div className="note-view">
			<div className="note-header">
				<input
					className="title-input"
					value={noteName}
					onChange={onNoteNameChange}
				/>
				<div className="note-tags">
					{editAccess && <input
						className="tags-input"
						value={tagString}
						onChange={onTagstringChange}
					/>}
					<div className="tags-list">
						{tags?.map((tag, i) => (<div key={i}>#{tag}</div>))}
					</div>
				</div>
			</div>
			<div className="toolbar">
				<Toolbar
					previewVisibility={[previewVisible, setPreviewVisible]}
					editorReference={CMEditor}
					user={user}
					note={note}
					noteID={noteID}
					editAccess={editAccess}
				/>
			</div>
			<div className={`note-panel ${previewVisible ? "" : "--preview-hidden"}`}>
				<div className="note-editor">
					<CodeMirror
						value={editorText}
						options={{							
							readOnly: !editAccess,
							...CodeMirrorOptions
						}}
						onBeforeChange={onEditorChange}
						ref={CMEditor}
					/>
				</div>
				<div className="note-preview">
					<Preview value={editorText} />
				</div>
			</div>
		</div>
	);
}

export default function NoteLoader({ user, noteID }) {	
	const noteRef = db.collection("notes").doc(noteID);
	const [note, loading, error] = useDocumentData(noteRef);

	return (
		<>
			{note && (note.publicAccess || user.uid === note.author) && <Editor user={user} note={note} noteID={noteID} />}
			{loading && "Loading…"}
			{error && "Error"}
		</>
	);
}