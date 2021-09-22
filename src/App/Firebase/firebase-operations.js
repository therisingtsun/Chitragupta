import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import firebaseConfig from "./firebase-config";
import GettingStarted from "./getting-started";

const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth(app);
auth.useEmulator("http://localhost:9099");

export const db = firebase.firestore(app);
db.useEmulator("localhost", 8080);

export const storage = firebase.storage(app);
storage.useEmulator("localhost", 9199);

export async function signInWith() {
	const provider = new firebase.auth.GoogleAuthProvider();
	const { user } = await auth.signInWithPopup(provider);
	const userRef = db.collection("users").doc(user.uid);
	const root = await userRef.get();
	if (!root.exists) {
		userRef.set({
			tier: "free"
		});
		createNote(user, {
			name: "Getting started",
			tags: ["tutorial", "guide", "this-is-a-long-tag-as-an-example"],
		}, GettingStarted(user.displayName));
	}
}

export async function createNote(user, noteData, content = "") {
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

export async function uploadNote(user, noteID, noteData, content) {
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

export async function modifyNoteContent(user, noteID, noteData, content) {
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

export async function modifyNoteMetadata(user, noteID, noteData) {
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

export async function deleteNote(user, noteID) {
	if (user) {
		return Promise.all([
			db.collection("notes").doc(noteID).delete(),
			storage.ref(`${user.uid}/${noteID}.md`).delete()
		]);
	} else {
		// no account usage goes here
	}
}