import "regenerator-runtime/runtime";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
	FirebaseAppProvider,
	AuthProvider,
	FirestoreProvider,
	StorageProvider,
	useFirebaseApp
} from "reactfire";
import firebaseConfig from "./App/Firebase/firebase-config";

import App from "./App";
import "./index.scss";

function FirebaseApp() {
	const app = useFirebaseApp();
	const auth = getAuth(app);
	const db = getFirestore(app);
	const storage = getStorage(app);

	// if (process.env.NODE_ENV !== "production") {
		connectAuthEmulator(auth, "http://localhost:9099");
		connectFirestoreEmulator(db, "localhost", 8080);
		connectStorageEmulator(storage, "localhost", 9199);
	// }

	return (
		<AuthProvider sdk={auth}>
			<FirestoreProvider sdk={db}>
				<StorageProvider sdk={storage}>
					<Router>
						<App />
					</Router>
				</StorageProvider>
			</FirestoreProvider>
		</AuthProvider>
	);
}

render(
	<FirebaseAppProvider firebaseConfig={firebaseConfig}>
		<FirebaseApp />
	</FirebaseAppProvider>,
	document.getElementById("root")
);