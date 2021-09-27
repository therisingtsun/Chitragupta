import React, { useEffect, useState } from "react";
import { Link, useLocation, Route, Switch, Redirect } from "react-router-dom";

import {
	getRedirectResult
} from "firebase/auth";
import {
	collection,
	query,
	where,
	orderBy,
} from "firebase/firestore";
import {
	useAuth,
	useFirestore,
	useFirestoreCollectionData,
	useStorage,
	useUser
} from "reactfire";
import {
	signInWithGoogle,
	createNote,
	deleteNote,
	modifyNoteMetadata,
	postSignIn
} from "./Firebase/firebase-operations";

import MI from "./Utils/MaterialIcons";
import Loader from "./Utils/Loader";

import Popup from 'reactjs-popup';

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";

import "./index.scss";
import LoadingMessage from "./loading-messages";
import Editor from "./Editor";
import StatusProvider, { useStatus } from "./Utils/StatusIndicator";

TimeAgo.addDefaultLocale(en);

function NewNotePopup() {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();
	const SM = useStatus();

	function add() {
		const p = createNote(auth, db, storage, { name: noteName });
		SM.add(p);
		return p;
	}
	const [noteName, setNoteName] = useState("New Note");

	function onChange(e) {
		const n = e.target.value;
		setNoteName(n);
	}
	function onBlur(e) {
		const n = e.target.value.trim();
		if (n.length <= 256) {
			setNoteName(n);
		} else setNoteName(noteName);
	}

	const [working, setWorking] = useState(false);

	return (
		<Popup trigger={
			<Link to="/" className="create-link">
				<MI className="--mr" icon="library_add" /> Note
			</Link>
		} modal className={working ? "--working" : ""}>
			{close => (
				<div className="popup-modal">{working
					? <>
						<p>
							Working…
						</p>
					</> 
					: <>
						<p>
							Name for new note:
						</p>
						<input
							maxLength="256"
							className="create-input"
							value={noteName}
							onChange={onChange}
							onBlur={onBlur}
						/>
						<p className="confirm-para">
							<Link to="/" onClick={() => {
								setWorking(true);
								add().then(() => {
									setWorking(false);
									close();
								});
							}} className="confirm-link create-confirm-link">
								Create
							</Link>
							<Link to="/" onClick={close}>
								Cancel
							</Link>
						</p>
					</>
				}
				</div>
			)}
		</Popup>
	);
}

function DeleteNotePopup({ note }) {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();

	const remove = () => deleteNote(auth, db, storage, note.id);

	return (
		<Popup trigger={
			<Link to="/" className="delete-link --right">
				Delete <MI icon="delete" />
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
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();
	const SM = useStatus();

	const [noteName, setNoteName] = useState(note.name);

	function onChange(e) {
		const n = e.target.value;
		if (n.length <= 256) {
			setNoteName(n);
		}
	}
	function onBlur(e) {
		const name = e.target.value.trim();
		if (name.length > 0 && name.length < 256 && name !== note.name) {
			setNoteName(name);
			SM.add(modifyNoteMetadata(auth, db, storage, note.id, { name }));
		} else {
			setNoteName(note.name);
		}
	}
	return (
		<div className="note-card">
			<div className="note-info">
				<input className="note-name" onChange={onChange} onBlur={onBlur} value={noteName} />
				<div className="visibility-icon">
					{note.publicAccess ? "Public" : "Private"}{" "}
					<MI icon={note.publicAccess ? "lock_open" : "lock"} />
				</div>
			</div>
			<div className="note-operations">
				<Link to={`?note=${note.id}`} className="edit-link">
					<MI icon="edit" /> Edit
				</Link>
				<DeleteNotePopup note={note} />
			</div>
			<div className="note-modified">Last modified {note.modified &&
				<ReactTimeAgo date={new Date(note.modified.seconds * 1000)} locale="en-US"/>
			}</div>
		</div>
	);
}

function NotesListing() {
	const auth = useAuth();
	const db = useFirestore();

	const [sort, setSort] = useState(localStorage.getItem("chitragupta-notes-listing-sort") ?? "modified");
	const [sortDir, setSortDir] = useState(localStorage.getItem("chitragupta-notes-listing-sort-direction") ?? "desc");

	const { status, data: notes, error } = useFirestoreCollectionData(query(
		collection(db, "notes"),
		where("author", "==", auth.currentUser.uid),
		orderBy(sort, sortDir)
	), {
		idField: "id"
	});

	switch (status) {
		case "success": {
			return notes.length
				? <>
					<div className="sort-buttons">
						<Link to="/" onClick={() => {
							const changed = sort === "name" ? "modified" : "name";
							localStorage.setItem("chitragupta-notes-listing-sort", changed);
							setSort(changed);
						}}>
							<MI icon={sort === "name" ? "sort_by_alpha" : "schedule"} />
						</Link>
						<Link to="/" onClick={() => {
							const changed = sortDir === "asc" ? "desc" : "asc";
							localStorage.setItem("chitragupta-notes-listing-sort-direction", changed);
							setSortDir(changed);
						}}>
							<MI icon={sortDir === "asc" ? "keyboard_double_arrow_up" : "keyboard_double_arrow_down"} />
						</Link>
					</div>
					<div className="notes-listing">{
						notes.map(n => <Note key={n.id} note={n} />)
					}</div>
				</>
				: <div className="notes-message">
					<p> No notes ;-; </p>
					<p> Create one? </p>
				</div>;
		}
		case "loading": {
			return <div className="notes-message">
				<p>{
					LoadingMessage()
				}</p>
			</div>;
		}
		case "error": {
			console.error(error);
			return <div className="notes-message">
				<p> An error has ocurred! Check the console for more details. </p>
			</div>;
		}
	}
}

function SignIn() {
	const auth = useAuth();

	return (
		<div className="welcome-screen">
			<h1> Welcome to Chitragupta </h1>
			<Link 
				to="/signin"
				className="sign-in-button"
				onClick={() => signInWithGoogle(auth)}
			>
				Sign In with Google
			</Link>
		</div>
	);
}

function SignInHandler() {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();

	const [status, setStatus] = useState("loading");

	useEffect(() => () => {});

	getRedirectResult(auth)
		.then(cred => {
			if (cred) {
				return postSignIn(auth, db, storage, cred.user);
			}
		})
		.then(() => {
			setStatus("success");
		});
	
	switch (status) {
		case "success": {
			return <Redirect to="/" />;
		}
		case "loading": {
			return <Loader />;
		}
	}
}

function SignOut() {
	const auth = useAuth();
	return (
		<Link to="/"
			className="sign-out-button"
			onClick={() => auth.signOut()}
		>
			Sign out <MI className="--ml" icon="logout" />
		</Link>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search).get("note");
}

function App() {
	const { data: user } = useUser();	
	const noteID = useQuery();

	if (noteID) {
		return <StatusProvider>
			<Editor noteID={noteID} />
		</StatusProvider>;
	} else {
		if (user === undefined) {
			return <Loader />;
		} else if (user === null) {
			return <SignIn />;
		} else {
			return (<>
				<h1 className="app-title">
					Chitragupta
				</h1>
				<h2 className="user-notes-title">
					{user.displayName}'s Notes:
				</h2>
				<StatusProvider>
					<div className="user-actions">
						<NewNotePopup />
						<SignOut />
					</div>
					<NotesListing />
				</StatusProvider>
			</>);
		}
	}
}

export default function AppRouter() {
	return (
		<Switch>
			<Route path="/signin">
				<SignInHandler />
			</Route>
			<Route path="/">
				<App />
			</Route>
		</Switch>
	);
}