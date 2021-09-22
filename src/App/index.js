import React, { useRef, useState } from "react";
import { Switch, Link, Route, useLocation } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import {
	auth,
	db,
	storage,
	signInWith,

	createNote,
	deleteNote,
	modifyNoteContent,
	uploadNote,
	modifyNoteMetadata
} from "../Firebase/firebase-operations";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLock,
	faUnlockAlt,
	faTrash,
	faPen,
} from '@fortawesome/free-solid-svg-icons'

import Popup from 'reactjs-popup';

import "./index.scss";
import LoadingMessage from "./loading-messages";
import Editor from "../Editor";

function CreateNote() {
	const add = () => createNote(auth.currentUser, {});		
	return (
		<button
			className="create-note-button"
			onClick={add}
		>
			Create Note
		</button>
	);
}

function NoteOps({ note }) {
	const modify = () => {
		modifyNoteContent(
			auth.currentUser, note.id, note,
			Math.random().toString(16) /* new data */
		);
	};
	const remove = () => {
		deleteNote(auth.currentUser, note.id);
	};
	const visibility = () => {
		const publicAccess = !note.publicAccess;
		modifyNoteMetadata(auth.currentUser, note.id, {
			publicAccess
		});
	};
	return (
		<div className="note-operations">
			<Link to={`/note/${note.id}`}>
				<FontAwesomeIcon icon={faPenSquare} />
			</Link>
			<a onClick={remove}>
				<FontAwesomeIcon icon={faTrash} />
			</a>
		</div>
	);
}

function DeleteNotePopup({ note }) {
	const remove = () => {
		deleteNote(auth.currentUser, note.id);
	};

	return (
		<Popup trigger={
			<Link to="/" className="delete-link">
				Delete <FontAwesomeIcon icon={faTrash} />
			</Link>
		} modal>
			{ close => (
				<div className="popup-modal">
					<p>
						This will permanently delete the note. Proceed?
					</p>
					<p className="delete-confirm-para">
						<Link to="/" onClick={remove} className="delete-confirm-link">
							Delete
						</Link>
						<Link to="/" onClick={close}>
							Cancel
						</Link>
					</p>
				</div>
			)}
		</Popup>
	);
}

function Note({ note, status }) {
	const [noteName, setNoteName] = useState(note.name);
	const blurEvent = async e => {
		const name = e.target.value.trim();
		if (name && name !== note.name) {
			status.current.innerHTML = "Syncing…"
			await modifyNoteMetadata(auth.currentUser, note.id, { name });
			status.current.innerHTML = "All changes saved";
		}
	}
	return (
		<div className="note-card">
			<div className="note-info">
				<input type="text" className="note-name" 
				onChange={(e) => setNoteName(e.target.value)}
				onBlur={blurEvent} value={noteName}/>
				<div className="visibility-icon">
					{note.publicAccess ? "Public" : "Private"}{" "}
					<FontAwesomeIcon icon={note.publicAccess ? faUnlockAlt : faLock} />
				</div>
			</div>
			<div className="note-operations">
				<Link to={`?note=${note.id}`} className="edit-link">
					<FontAwesomeIcon icon={faPen} /> Edit
				</Link>
				<DeleteNotePopup note={note}/>
			</div>
		</div>
	);
}

function NotesListing() {
	const statusRef = useRef(null);
	if (auth.currentUser) {
		const [notes, loading, error] = useCollectionData(
			db.collection("notes")
				.where("author", "==", auth.currentUser.uid)
				.orderBy("modified", "desc")
			, {
				idField: "id"
			}
		);
	
		return (
			<>
				<SignOut />
				<div className="user-notes-title">
					{auth.currentUser.displayName}'s Notes:
				</div>
				<div className="status-indicator" ref={statusRef}></div>
				<p>
					<CreateNote />
				</p>
				<div className="notes-listing">
					{notes && notes.map(n => (
						<Note key={n.id} note={n} status={statusRef}/>
					))}
				</div>
				{loading && <div className="notes-loader">{LoadingMessage()}</div>}
				{error && `ERROR: ${JSON.stringify(error)}`}
			</>
		);
	} else return (null);
}

function SignIn() {
	return (
		<>
			<p> Welcome! </p>
			<button
				className="sign-in-button"
				onClick={signInWith}
			>
				Sign In with Google
			</button>
		</>
	);
}

function SignOut() {
	return auth.currentUser && (
		<button
			className="sign-out-button"
			onClick={() => auth.signOut()}
		>
			Sign out
		</button>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search).get("note");
}

export default function App() {
	const [user] = useAuthState(auth);
	const noteID = useQuery();

	return (
		<>{noteID
			? <Editor user={user} noteID={noteID} />
			: user ? <NotesListing /> : <SignIn />
		}</>
	);
}