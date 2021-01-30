import firebase from "firebase";
import "firebase/auth";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { callbackify } from "util";

const firebaseConfig = {
  apiKey: "AIzaSyBTZqNRnrfcgfRjE3SvPiqtDVsADFNXIxM",
  authDomain: "yada-comp451.firebaseapp.com",
  databaseURL: "https://yada-comp451.firebaseio.com",
  projectId: "yada-comp451",
  storageBucket: "yada-comp451.appspot.com",
  messagingSenderId: "584848197896",
  appId: "1:584848197896:web:9b75a59a06ca70ccb844bd",
  measurementId: "G-RDWW2L2ERC",
};

var fireInstance = firebase.initializeApp(firebaseConfig);
var fireStore = fireInstance.firestore();
var fireAuth = firebase.auth();


const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  // custom parameters
});

export function signInWithGoogle() {
  fireAuth.signInWithPopup(googleProvider);
}

export function fireAuthSignOut() {
  fireAuth.signOut();
}

export function signUpWithEmail(email: string, password: string) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

export function signInWithEmail(email: string, password: string): Promise<any> {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
      return new Promise(function (resolve, reject) {
        resolve(user);
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

export const auth = fireInstance.auth();
export default fireInstance;

// Firebase functions
export function fireIncrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export function fireDecrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export let fireDelete = firebase.firestore.FieldValue.delete();
export let Timestamp = firebase.firestore.Timestamp;
