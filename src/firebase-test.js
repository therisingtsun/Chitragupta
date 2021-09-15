import React from "react";

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



function CreatFile() {
	if (auth.currentUser) {
		const filesRef = db.collection("files");
		const storageRef = storage.ref();
		const add = () => {
			filesRef
				.add({
					author: auth.currentUser.uid,
					created: firebase.firestore.FieldValue.serverTimestamp(),
					modified: firebase.firestore.FieldValue.serverTimestamp(),
					publicAccess: false,
					name: Math.random().toString(16),
					
				})
				.then(file => {
					return storageRef.child(`${auth.currentUser.uid}/${file.id}.md`).putString(
						Math.random().toString(16),
						"raw",
						{
							contentType: "text/plain",
							customMetadata: {
								publicAccess: false
							}
						}
					);
				})
				.then(snap => {
					// console.log(snap);
				});
		};
		
		return (
			<button onClick={add}>Create File</button>
		);
	} else return (null);
}

function FileOps({ file }) {
	if (auth.currentUser) {
		const f = db.collection("files").doc(file.id);
		const s = storage.ref(`${file.author}/${file.id}.md`);
		const modify = () => {
			f.update({
				modified: firebase.firestore.FieldValue.serverTimestamp()
			});
			// s.putString(/* new data */);
		};
		const remove = () => {
			f.delete();
			s.delete();
		};
		const visibility = () => {
			const publicAccess = !file.publicAccess;
			f.update({
				publicAccess
			});
			s.updateMetadata({
				customMetadata: {
					publicAccess
				}
			});
		};
		return (
			<span>
				<label>
					<input type="checkbox" defaultChecked={file.publicAccess} onChange={visibility} /> 
					Public?
				</label> <button
					onClick={modify}>Modify File
				</button> <button
					onClick={remove}>Remove File
				</button>
			</span>
		);
	} else return (null);
}

function SignOut() {
	return auth.currentUser && (
		<button onClick={() => auth.signOut()}>Sign out</button>
	);
}

function Files() {
	if (auth.currentUser) {
		const filesRef = db.collection("files");
		const q = filesRef
			.where("author", "==", auth.currentUser.uid)
			.orderBy("modified", "desc");
	
		const [files, loading, error] = useCollectionData(q, {
			idField: "id"
		});
	
		return (
			<div>
				<SignOut />
				<p> {auth.currentUser.displayName}'s Notes: </p>
				<p>
					<CreatFile />
				</p>
				<div>
					{files && files.map(f => (
						<div key={f.id}>
							<pre><code>
								File ID: {f.id} <br />
								File Name: {f.name} 
							</code></pre>
							<FileOps file={f} />
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
	const signInWith = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider)
			.then(cred => {
				// console.log(cred);
			});
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
		<div >
			{user ? <Files /> : <SignIn />}
		</div>
	);
}