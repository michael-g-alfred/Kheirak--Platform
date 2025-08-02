import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiHYxmuWQeQnP6SFTtL4SZb7PpUx_wDms",
  authDomain: "donation-platform-97418.firebaseapp.com",
  projectId: "donation-platform-97418",
  storageBucket: "donation-platform-97418.firebasestorage.app",
  messagingSenderId: "773911549",
  appId: "1:773911549:web:fa1c78d7cefd39b1331f94",
  measurementId: "G-RYRNW1J9PD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
