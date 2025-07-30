import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";
import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  console.log("creating user");
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  console.log("signing in");
  const res = await signInWithEmailAndPassword(auth, email, password);

  const userRef = doc(db, "Users", res.user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    console.log("User role:", userSnap.data().role);
  } else {
    console.log("No such user document!");
  }

  return res;
};

export const doSignInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, googleProvider);
  //   return res.user;
  return res;
};

export const doSignOut = async () => {
  console.log("signing out");
  return signOut(auth);
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordUpdate = async (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doEmailVerification = async () => {
  return sendEmailVerification(auth.currentUser);
};
