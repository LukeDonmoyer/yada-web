import firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTZqNRnrfcgfRjE3SvPiqtDVsADFNXIxM",
  authDomain: "yada-comp451.firebaseapp.com",
  databaseURL: "https://yada-comp451.firebaseio.com",
  projectId: "yada-comp451",
  storageBucket: "yada-comp451.appspot.com",
  messagingSenderId: "584848197896",
  appId: "1:584848197896:web:5bc77aad841c51c9b844bd",
  measurementId: "G-CYXQ4Q1RG2",
};

var adminInstance = firebase.initializeApp(firebaseConfig, "secondary");
var adminStore = adminInstance.firestore();
var adminAuth = adminInstance.auth();

export function registerUser(
  adminUID: string,
  userEmail: string,
): Promise<any> {
  return adminStore
    .collection("Users")
    .doc(adminUID)
    .get()
    .then((user) => {
      if (user.exists) {
        if (user.data()?.userGroup === "Owner") {
            return adminAuth.createUserWithEmailAndPassword(userEmail, 'yadaDefault').then((user) => {
                return new Promise((resolve, reject) => {
                    resolve(user);
                })
            })
        } else {
          alert("innapropriate user permissions for this action");
        }
      }
    });
}
