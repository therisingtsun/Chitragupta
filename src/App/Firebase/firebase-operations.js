import {
	GoogleAuthProvider,
	signInWithRedirect,
} from "firebase/auth";
import {
	collection,
	doc,
	getDoc,
	addDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	serverTimestamp
} from "firebase/firestore";
import {
	ref,
	uploadString,
	deleteObject
} from "firebase/storage";

import GettingStarted from "./getting-started";

export function signInWithGoogle(auth) {
	const provider = new GoogleAuthProvider();
	return signInWithRedirect(auth, provider);
}

export async function postSignIn(auth, db, storage, user) {
	const userRef = doc(db, "users", user.uid);
	const root = await getDoc(userRef);
	if (!root.exists()) {
		setDoc(userRef, {
			tier: "free"
		});
		return createNote(auth, db, storage, {
			name: "Getting started",
			tags: ["tutorial", "guide", "this-is-a-long-tag-as-an-example"],
		}, GettingStarted(user.displayName));
	}
}

export async function createNote(auth, db, storage, noteData, content = "") {
	if (auth.currentUser) {
		const data = Object.assign({
			author: auth.currentUser.uid,
			created: serverTimestamp(),
			modified: serverTimestamp(),
			publicAccess: false,
			name: "New Note",
			tags: ["add-tags-here"]
		}, noteData);

		const note = await addDoc(collection(db, "notes"), data);

		if (typeof content === "string") {
			await uploadNote(auth, db, storage, note.id, data, content);
		}

		return [
			Object.assign({ id: note.id }, data),
			note,
		];
	} else {
		// no account usage goes here
	}
}

export async function uploadNote(auth, db, storage, noteID, noteData, content) {
	if (typeof content === "string") {
		if (auth.currentUser) {
			const metadata = { contentType: "text/plain" };

			return uploadString(
				ref(storage, `${auth.currentUser.uid}/${noteID}.md`),
				content, "raw", metadata
			);
		} else {
			// no account usage goes here
		}
	} else return null;
}

export async function modifyNoteContent(auth, db, storage, noteID, noteData, content) {
	if (typeof content === "string") {
		if (auth.currentUser) {
			const data = Object.assign({
				modified: serverTimestamp()
			}, noteData);
			
			const uploadResult = (await Promise.all([			
				uploadNote(auth, db, storage, noteID, data, content),
				updateDoc(doc(db, "notes", noteID), data),
			]))[0];

			return [
				Object.assign({ id: noteID }, data),
				uploadResult
			];
		} else {
			// no account usage goes here
		}
	} else return null;
}

export async function modifyNoteMetadata(auth, db, storage, noteID, noteData) {
	if (auth.currentUser) {
		const data = Object.assign({
			modified: serverTimestamp()
		}, noteData);

		await updateDoc(doc(db, "notes", noteID), data);
	} else {
		// no account usage goes here
	}
}

export async function deleteNote(auth, db, storage, noteID) {
	if (auth.currentUser) {
		return Promise.all([
			deleteDoc(doc(db, "notes", noteID)),
			deleteObject(ref(storage, `${auth.currentUser.uid}/${noteID}.md`)),
		]);
	} else {
		// no account usage goes here
	}
}