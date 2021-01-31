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
export var fireAuth = firebase.auth();

export function changePassword(newPassword: string): Promise<any> | undefined {
  return fireAuth.currentUser?.updatePassword(newPassword).then(
    () => {
      // Update successful.
      return fireStore
        .collection("Users")
        .doc(fireAuth.currentUser?.uid)
        .update({
          defaults: false,
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        });
    },
    (error) => {
      // An error happened.
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  );
}

export function getUserData(uid: string): Promise<any> {
  return fireStore
    .collection("Users")
    .doc(uid)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("found the document");
        return new Promise((resolve, reject) => {
          resolve(doc.data());
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

export function fireAuthSignOut(): Promise<any> {
  return fireAuth.signOut().then(() => {
    return new Promise(function (resolve, reject) {
      resolve(null);
    });
  });
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
  return fireAuth
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

export function createUserDocument(
  uid: string,
  email: string,
  userGroup: string
) {
  fireStore.collection("Users").doc(uid).set({
    defaults: true,
    email: email,
    phoneNumber: null,
    userGroup: userGroup,
  });
}

// Firebase functions
export function fireIncrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export function fireDecrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export let fireDelete = firebase.firestore.FieldValue.delete();
export let Timestamp = firebase.firestore.Timestamp;
