import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import {
	auth,
	db,
	signInWith,

	createNote,
	deleteNote,
	modifyNoteMetadata
} from "./Firebase/firebase-operations";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLock,
	faUnlockAlt,
	faTrash,
	faPen,
	faPlus,
} from '@fortawesome/free-solid-svg-icons'

import Popup from 'reactjs-popup';

import "./index.scss";
import LoadingMessage from "./loading-messages";
import Editor from "./Editor";

function NewNotePopup() {
	const add = () => createNote(auth.currentUser, { name: noteName });
	const [noteName, setNoteName] = useState("New Note");

	function onChange(e) {
		const n = e.target.value;
		if (n.length <= 256) {
			setNoteName(n);
		}
	}
	function onBlur(e) {
		const n = e.target.value.trim();
		setNoteName(n);
	}

	return (
		<Popup trigger={
			<Link to="/" className="create-link">
				<FontAwesomeIcon icon={faPlus} /> Create new Note
			</Link>
		} modal>
			{close => (
				<div className="popup-modal">
					<p>
						Name for new note:
					</p>
					<input
						className="create-input"
						value={noteName}
						onChange={onChange}
						onBlur={onBlur}
					/>
					<p className="confirm-para">
						<Link to="/" onClick={() => {
							add();
							close();
						}} className="confirm-link create-confirm-link">
							Create
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

function DeleteNotePopup({ note }) {
	const remove = () => deleteNote(auth.currentUser, note.id);

	return (
		<Popup trigger={
			<Link to="/" className="delete-link">
				Delete <FontAwesomeIcon icon={faTrash} />
			</Link>
		} modal>
			{close => (
				<div className="popup-modal">
					<p>
						This will permanently delete the note. Proceed?
					</p>
					<p className="confirm-para">
						<Link to="/" onClick={remove} className="confirm-link delete-confirm-link">
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

function Note({ note }) {
	const [noteName, setNoteName] = useState(note.name);
	const blurEvent = async e => {
		const name = e.target.value.trim();
		if (name && name !== note.name) {
			await modifyNoteMetadata(auth.currentUser, note.id, { name });
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
	if (auth.currentUser) {
		const [notes, loading, error] = useCollectionData(
			db.collection("notes")
				.where("author", "==", auth.currentUser.uid)
				.orderBy("modified", "desc")
			, {
				idField: "id"
			}
		);

		if (notes) {
			return notes.length
				? <div className="notes-listing">{
					notes?.map(n => <Note key={n.id} note={n} />)
				}</div>
				: <div className="notes-message">
					<p> No notes ;-; </p>
					<p> Create one? </p>
				</div>;
		} else if (loading) {
			return <div className="notes-message">
				<p>{
					LoadingMessage()
				}</p>
			</div>;
		} else if (error) {
			console.error(error);
			return <div className="notes-message">
				<p> An error ocurred! Check the console for more details. </p>
			</div>;
		} else return (null);
	} else return (null);
}

function SignIn() {
	return (
		<>
			<h1> Welcome! </h1>
			<Link to="/"
				className="sign-in-button"
				onClick={signInWith}
			>
				Sign In with Google
			</Link>
		</>
	);
}

function SignOut() {
	return auth.currentUser && (
		<Link to="/"
			className="sign-out-button"
			onClick={() => auth.signOut()}
		>
			Sign out
		</Link>
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
			: user
				? <>
					<h1 className="user-notes-title">
						{auth.currentUser.displayName}'s Notes:
					</h1>
					<div className="user-actions">
						<SignOut />
						<NewNotePopup />
					</div>
					<div className="status-indicator"></div>
					<NotesListing />
				</>
				: <SignIn />
		}</>
	);
}