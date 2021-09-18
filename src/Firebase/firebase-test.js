import React, { createContext, useContext } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import firebaseConfig from "./firebase-config";

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
auth.useEmulator("http://localhost:9099");

const db = firebase.firestore();
db.useEmulator("localhost", 8080);

const storage = firebase.storage();
storage.useEmulator("localhost", 9199);



async function createNote(user, noteData, content = "") {
	if (user) {
		const data = Object.assign({
			author: user.uid,
			created: firebase.firestore.FieldValue.serverTimestamp(),
			modified: firebase.firestore.FieldValue.serverTimestamp(),
			publicAccess: false,
			name: "New Note",
			tags: []
		}, noteData);

		const note = await db.collection("notes").add(data);

		if (typeof content === "string") {
			uploadNote(user, note.id, data, content);
		}

		return [
			Object.assign({ id: note.id }, data),
			note,
		];
	} else {
		// no account usage goes here
	}
}

async function uploadNote(user, noteID, noteData, content) {
	if (typeof content === "string") {
		if (user) {
			const metadata = {
				contentType: "text/plain",
				customMetadata: {}
			};
			if (noteData.hasOwnProperty("publicAccess")) metadata.customMetadata["publicAccess"] = noteData.publicAccess;

			return storage.ref().child(`${user.uid}/${noteID}.md`).putString(content, "raw", metadata);
		} else {
			// no account usage goes here
		}
	} else return null;
}

async function modifyNoteContent(user, noteID, noteData, content) {
	if (typeof content === "string") {
		if (user) {
			const data = Object.assign({
				modified: firebase.firestore.FieldValue.serverTimestamp()
			}, noteData);
			
			const uploadTask = (await Promise.all([			
				uploadNote(user, noteID, data, content),
				db.collection("notes").doc(noteID).update(data),
			]))[0];

			return [
				Object.assign({ id: noteID }, data),
				uploadTask
			];
		} else {
			// no account usage goes here
		}
	} else return null;
}

async function modifyNoteMetadata(user, noteID, noteData) {
	if (user) {
		const data = Object.assign({}, noteData);

		await db.collection("notes").doc(noteID).update(data);
		if (noteData.hasOwnProperty("publicAccess")) await storage.ref(`${user.uid}/${noteID}.md`).updateMetadata({
			customMetadata: {
				publicAccess: noteData.publicAccess
			}
		});
	} else {
		// no account usage goes here
	}
}

async function deleteNote(user, noteID) {
	if (user) {
		return Promise.all([
			db.collection("notes").doc(noteID).delete(),
			storage.ref(`${user.uid}/${noteID}.md`).delete()
		]);
	} else {
		// no account usage goes here
	}
}


function CreateNote() {
	const add = () => createNote(auth.currentUser, {});		
	return (
		<button onClick={add}>Create Note</button>
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
		<span>
			<label>
				<input
					type="checkbox"
					defaultChecked={note.publicAccess}
					onChange={visibility}
				/> Public?
			</label>
			{" "} <button onClick={modify}> Modify Note </button>
			{" "} <button onClick={remove}> Remove Note </button>
		</span>
	);
}

function SignOut() {
	return auth.currentUser && (
		<button onClick={() => auth.signOut()}> Sign out </button>
	);
}

function Notes() {
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
				<div>
					{notes && notes.map(f => (
						<div key={f.id}>
							<pre><code>
								Note ID: {f.id} <br />
								Note Name: {f.name} 
							</code></pre>
							<NoteOps note={f} />
						</div>
					))}
					{loading && "Loading..."}
					{error && `ERROR: ${JSON.stringify(error)}`}
				</div>
			</div>
		);
	} else return (null);
}

function SignIn() {
	const signInWith = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		const { user } = await auth.signInWithPopup(provider);
		const userRef = db.collection("users").doc(user.uid);
		const root = await userRef.get();
		if (!root.exists) {
			userRef.set({
				tier: "free"
			});
			createNote(auth.currentUser, {
				name: "Getting started",
				tags: ["tutorial", "guide", "this-is-a-long-tag-as-an-example"],
			});
		}
	};
	
	return (
		<div>
			<p> Welcome! </p>
			<button onClick={signInWith}>Sign In</button>
		</div>
	);
}

export default function Fb() {
	const [user] = useAuthState(auth);
	return (
		<div>
			{user ? <Notes /> : <SignIn />}
		</div>
	);
}