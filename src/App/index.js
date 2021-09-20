import React, { useState } from "react";
import { Switch, Link, Route } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import {
	auth,
	db,
	storage,
	signInWith,

	createNote,
	modifyNote,
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

import "./index.scss";

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

function Tag({ tag }) {
	const [active, setActive] = useState(false);

	const toggleActive = () => {
		setActive(!active);
	};

	return (
		<div
			className={`
				note-tag
				${active ? "--active" : ""}
			`}
			onClick={toggleActive}
		>
			#{tag}
		</div>
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
		modifyNoteMetadata(auth.currentUser.uid, note.id, {
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

function Note({ note }) {
	const remove = () => {
		deleteNote(auth.currentUser, note.id);
	};

	return (
		<div className="note-card">
			<div className="note-info">
				<div className="note-name">{note.name}</div>	
				<div className="visibility-icon">
					{note.publicAccess ? "Public" : "Private"}{" "}
					<FontAwesomeIcon icon={note.publicAccess ? faUnlockAlt : faLock} />
				</div>
			</div>
			<div className="note-operations">
				<Link to={`/note/${note.id}`} className="edit-link">
					<FontAwesomeIcon icon={faPen} /> Edit
				</Link>
				<Link to="/" onClick={remove} className="delete-link">
					Delete <FontAwesomeIcon icon={faTrash} />
				</Link>
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
	
		return (
			<div>
				<SignOut />
				<p> {auth.currentUser.displayName}'s Notes: </p>
				<p>
					<CreateNote />
				</p>
				<div class="notes-listing">
					{notes && notes.map(n => (
						<Note key={n.id} note={n} />
					))}
					{loading && "Loading..."}
					{error && `ERROR: ${JSON.stringify(error)}`}
				</div>
			</div>
		);
	} else return (null);
}

function SignIn() {
	return (
		<div>
			<p> Welcome! </p>
			<button
				className="sign-in-button"
				onClick={signInWith}
			>
				Sign In with Google
			</button>
		</div>
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

export default function App() {
	const [user] = useAuthState(auth);
	return (
		<div>
			{user ? <NotesListing /> : <SignIn />}
		</div>
	);
}