/**
 * Firestore connection for all non-administrative firestore queries
 * author: Shaun Jorstad
 *
 */
import firebase from "firebase";
import "firebase/auth";
import updateChannelTemplatesSlice from "store/ChannelTemplateActions";
import updateSitesSlice from "store/SiteActions";
import store from "store/store";
import updateUsersSlice from "store/UserAction";
import updateLoggersSlice from "store/LoggerAction";
import {EquipmentUnit} from "store/FirestoreInterfaces";
import { firestoreConnect } from "react-redux-firebase";

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

const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

/**
 * Changes the password for the logged in user
 * @param newPassword
 * returns a promise resolved with nothing
 */
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

/**
 * Fetches the User document specified
 * @param uid
 *
 * returns a promise that resolves with the user document
 */
export function getUserData(uid: string): Promise<any> {
  return fireStore
    .collection("Users")
    .doc(uid)
    .get()
    .then(function (doc) {
      if (doc.exists) {
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

/**
 * Fetches the user permission level of the currently authenticated user. (this is stored in /Users/{uid}/userGroup)
 *
 * returns a promise that resolves with a string. The string will be one of the following 'Owner', 'Admin', 'Power', 'User'
 */
export function getUserPrivilege(): Promise<any> {
  return fireStore
    .collection("Users")
    .doc(fireAuth.currentUser?.uid)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        return new Promise((resolve, reject) => {
          resolve(doc.data()?.userGroup);
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

/**
 * signs out the current user
 * returns a promise that resolves without arguments
 */
export function fireAuthSignOut(): Promise<any> {
  return fireAuth.signOut().then(() => {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  });
}

/**
 * attemps to sign in the user
 * @param email
 * @param password
 *
 * returns a promise that resolves with the successfully signed in user document
 */
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
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

/**
 * Creates the user document associated with accounts
 * @param uid
 * @param email
 * @param userGroup
 */
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

/**
 * Creates an email document which will be later sent to admins and then deleted
 * @param email
 * @param message
 */
export function createEmailDocument(
  email: string,
  message: string,
  subject: string
) {
  fireStore.collection("Emails").add({
    email: email,
    subject: subject,
    message: message,
  });
}

/**
 * Sends the authorization email (via the password reset template)
 * @param address address to reset
 */
export function sendAuthorizationEmail(address: string) {
  fireAuth
    .sendPasswordResetEmail(address)
    .then(function () {
      // Email sent.
      console.log("email sent");
    })
    .catch(function (error) {
      // An error happened.
      console.log("email failed");
      console.log(error);
    });
}

/**
 * creates a new empty site document
 */
export function createNewSite() {
  fireStore
    .collection("Sites")
    .add({
      name: "new site",
      notes: "",
      address: "",
      userNotifications: {},
      equipmentUnits: {},
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

export function createNewEquipment(site_uid: string, equipment_name: string){
  const newEquipment: EquipmentUnit = {
    faults : [],
    loggers: [],
    name : equipment_name,
    health: "Unknown",
    type: "Unassigned"
  };

  fireStore.collection("Sites").doc(site_uid).update({equipmentUnits: arrayUnion(newEquipment)});
}

export function initializeSitesListener() {
  console.log("initializing sites listener");
  fireStore.collection("Sites").onSnapshot((querySnapshot) => {
    var sites: any = {};
    querySnapshot.forEach((doc) => {
      sites[doc.id] = doc.data();
    });
    // call reducer to store each site
    store.dispatch(updateSitesSlice.actions.updateSites(sites));
  });
}

export function initializeLoggersListener(){
  console.log("initializing loggers listener");
  fireStore.collection("Loggers").onSnapshot((querySnapshot) => {
    var loggers: any = {};
    querySnapshot.forEach((doc) => {
      loggers[doc.id] = doc.data();
    });
    //call reducer to store each logger
    store.dispatch(updateLoggersSlice.actions.updateLoggers(loggers));
  })
}

export function initializeUsersListener() {
  getUserPrivilege().then((privilege) => {
    if (["Owner", "Admin"].includes(privilege)) {
      // listen to entire users collection
      fireStore.collection("Users").onSnapshot((querySnapshot) => {
        var users: any = {};
        querySnapshot.forEach((doc) => {
          users[doc.id] = doc.data();
        });
        // call reducer to store each site
        store.dispatch(updateUsersSlice.actions.updateUsers(users));
      });
    } else {
      // listen only to current user document
      fireStore
        .collection("Users")
        .doc(fireAuth.currentUser?.uid)
        .onSnapshot((doc) => {
          var users: any = {};
          users[doc.id] = doc.data();
          // call reducer to store each site
          store.dispatch(updateUsersSlice.actions.updateUsers(users));
        });
    }
  });
}

export function initializeChannelTemplatesListener() {
  console.log("initializing channel templates listener");
  fireStore.collection("ChannelTemplates").onSnapshot((querySnapshot) => {
    var templates: any = {};
    querySnapshot.forEach((doc) => {
      templates[doc.id] = doc.data();
    });
    // call reducer to store each site
    store.dispatch(
      updateChannelTemplatesSlice.actions.updateChannelTemplates(templates)
    );
  });
}

export function resetRedux() {
  store.dispatch(updateUsersSlice.actions.updateUsers({}));
  store.dispatch(updateSitesSlice.actions.updateSites({}));
  store.dispatch(
    updateChannelTemplatesSlice.actions.updateChannelTemplates({})
  );
}

// useful firestore functions that will be used later in development
export function fireIncrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export function fireDecrement(val: number) {
  return firebase.firestore.FieldValue.increment(val);
}
export let fireDelete = firebase.firestore.FieldValue.delete();
export let Timestamp = firebase.firestore.Timestamp;
