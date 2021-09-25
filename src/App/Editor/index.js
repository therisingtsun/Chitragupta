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

import Timer from "../Utils/Timer";

import "./index.scss";
import Toolbar from "./Toolbar";
import Preview from "./Preview";
import Loader from "../Utils/Loader";
import { useStatus } from "../Utils/StatusIndicator";

let lastEdited = null;

function Editor({ note, noteID, content }) {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();
	const SM = useStatus();
	
	useEffect(() => {
		lastEdited = new Timer(() => { }, 1000);

		return () => {
			lastEdited = null;
		};
	}, []);

	const [noteName, setNoteName] = useState(note.name);
	const [tags, setTags] = useState(note.tags);
	const [tagString, setTagString] = useState(note.tags.join(" "));
	const [editorText, setEditorText] = useState(content);

	const editAccess = auth.currentUser?.uid === note.author;

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
				SM.add(modifyNoteMetadata(auth, db, storage, noteID, { name }));
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
			SM.add(modifyNoteMetadata(auth, db, storage, noteID, { tags }));
		} else {
			setTagString(note.tags.join(" "));
			setTags(note.tags);
		}
	}

	function onEditorChange(editor, data, value) {
		lastEdited.callback = function () {
			const t = value;
			SM.add(modifyNoteContent(auth, db, storage, noteID, {
				publicAccess: note.publicAccess
			}, t));
		};
		lastEdited.reset().resume();
		setEditorText(value);
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

function ContentLoader({ note, noteID }) {
	const storage = useStorage();

	const { data: url } = useStorageDownloadURL(ref(storage, `${note.author}/${noteID}.md`));

	const [content, setContent] = useState(null);

	if (url) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "text";
		xhr.onload = () => {
			setContent(xhr.response);
		};
		xhr.open("GET", url);
		xhr.send();
	}

	if (content !== null) {
		return <Editor note={note} content={content} noteID={noteID} />
	} else {
		return <Loader />;
	}
}

export default function EditorLoader({ noteID }) {
	const auth = useAuth();
	const db = useFirestore();

	const { status, data: note, error } = useFirestoreDocData(doc(db, "notes", noteID));

	switch (status) {
		case "success": {
			if (note && (note.publicAccess || auth.currentUser?.uid === note.author)) {
				return <ContentLoader note={note} noteID={noteID} />;
			}
			else return "No permission."
		}
		case "loading": {
			return <Loader />;
		}
		case "error": {
			console.error(error);
			return "An error has ocurred! Check the console for more details.";
		}
	}
}