import React, { useState, useRef, useEffect } from "react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/selection/active-line";
import "codemirror/keymap/sublime";

import "./MarkdownChitragupta";
import "./CodeMirror/base.css";
import "./CodeMirror/theme-dark.css";
import CodeMirrorOptions from "./CodeMirror/options";

import {
	doc
} from "firebase/firestore";
import {
	ref
} from "firebase/storage";
import {
	useAuth,
	useFirestore,
	useFirestoreDocData,
	useStorage,
	useStorageDownloadURL
} from "reactfire";

import {
	modifyNoteContent,
	modifyNoteMetadata
} from "../Firebase/firebase-operations";

import "./index.scss";
import Toolbar from "./Toolbar";
import Preview from "./Preview";

function Editor({ note, noteID }) {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();

	const [noteName, setNoteName] = useState(note.name);
	const [tags, setTags] = useState(note.tags);
	const [tagString, setTagString] = useState(note.tags.join(" "));
	const [editorText, setEditorText] = useState("Loading…");

	const editAccess = auth.currentUser?.uid === note.author;

	const { data: url } = useStorageDownloadURL(ref(storage, `${note.author}/${noteID}.md`));
	
	const [contentLoaded, setContentLoaded] = useState(false);
	
	if (url && !contentLoaded) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "text";
		xhr.onload = (event) => {			
			// CMEditor?.current?.editor.setValue(xhr.response);
			setEditorText(xhr.response);
			setContentLoaded(true);
		};
		xhr.open("GET", url);
		xhr.send();
	}

	const [previewVisible, setPreviewVisible] = useState(true);

	const CMEditor = useRef(null);

	function onNoteNameChange(e) {
		if (editAccess) {
			setNoteName(e.target.value);
		}
	}
	function onNoteNameBlur(e) {
		if (editAccess) {
			const name = e.target.value.trim();
			if (name.length > 0 && name.length <= 256 && name !== note.name) {
				setNoteName(name);
				modifyNoteMetadata(auth, db, storage, noteID, { name });
			} else {
				setNoteName(note.name);
			}
		}
	}

	function onTagstringChange(e) {
		const t = e.target.value;
		setTagString(t);
		setTags(t.trim().split(/\s+/).filter(s => s.length));
	}
	function onTagStringBlur(e) {
		const t = e.target.value.trim();
		const tags = t.split(/\s+/).filter(s => s.length);
		if (t.length > 0 && t.length <= 256 && t !== note.tags.join(" ")) {
			setTagString(t);
			setTags(tags);
			modifyNoteMetadata(auth, db, storage, noteID, { tags });
		} else {
			setTagString(note.tags.join(" "));
			setTags(note.tags);
		}
	}

	function onEditorChange(editor, data, value) {
		setEditorText(value);
	}
	function onEditorBlur(editor) {
		const t = editor.doc.getValue();
		if (t !== editorText) {
			setEditorText(t);
			modifyNoteContent(auth, db, storage, noteID, {
				publicAccess: note.publicAccess
			}, t);
		}
	}

	if (!editAccess && !note.publicAccess) {
		return "No permissun, sowwies…";
	} else return (
		<div className="note-view">
			<div className="note-header">
				<input
					maxLength="256"
					disabled={!editAccess}
					className="title-input"
					value={noteName}
					onChange={onNoteNameChange}
					onBlur={onNoteNameBlur}
				/>
				<div className="note-tags">
					{editAccess && <input
						maxLength="256"
						className="tags-input"
						value={tagString}
						onChange={onTagstringChange}
						onBlur={onTagStringBlur}
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
						onBlur={onEditorBlur}
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

export default function EditorLoader({ noteID }) {
	const auth = useAuth();
	const db = useFirestore();

	const { status, data: note, error } = useFirestoreDocData(doc(db, "notes", noteID));

	switch (status) {
		case "success": {
			if (note && (note.publicAccess || auth.currentUser?.uid === note.author)) {
				return <Editor note={note} noteID={noteID} />;
			}
			else return "No permission."
		}
		case "loading": {
			return "Loading…";
		}
		case "error": {
			console.error(error);
			return "An error has ocurred! Check the console for more details.";
		}
	}
}