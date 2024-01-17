import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAzd2gASeejLD44xQfX1uNGg0pd35hgYro",
	authDomain: "mwitter-c1959.firebaseapp.com",
	projectId: "mwitter-c1959",
	storageBucket: "mwitter-c1959.appspot.com",
	messagingSenderId: "68476785542",
	appId: "1:68476785542:web:d3f05f51793ef2a6b61207",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
