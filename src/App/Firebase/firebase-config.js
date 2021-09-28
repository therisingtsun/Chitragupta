export default function firebaseConfig() {
	if (process.env.NODE_ENV !== "production") {
		return {
			apiKey: "test",
			authDomain: "test",
			projectId: "dv-chitragupta",
			storageBucket: "default-bucket",
			messagingSenderId: "test",
			appId: "test"
		}
	} else {
		return {
			apiKey: process.env.FB_API_KEY,
			authDomain: process.env.FB_AUTH_DOMAIN,
			projectId: process.env.FB_PROJECT_ID,
			storageBucket: process.env.FB_STORAGE_BUCKET,
			messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
			appId: process.env.FB_APP_ID
		}
	}
}