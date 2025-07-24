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
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, googleProvider);
  //   return res.user;
  return res;
};

export const doSignOut = async () => {
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
