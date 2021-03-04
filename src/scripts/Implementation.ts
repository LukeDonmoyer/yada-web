/**
 * implementation of datastore functionality. All functions must be completed for the app to function. Functions marked as 'REQUIRED' need to be implemented, and must accept the specified arguments and return the specified return values. Any auxiliary functions may be written as necessary
 */
import updateChannelTemplatesSlice from "store/ChannelTemplateActions";
import { EquipmentUnit } from "store/FirestoreInterfaces";
import sitesSlice from "store/SiteActions";
import store from "store/store";
import updateUsersSlice from "store/UserAction";
import * as fire from "./FireConfig";

/**
 * -- REQUIRED --
 * handles user auth state cahnges. the callback must be called whenever the authenticated user changes. The userAuth parameter to the callback function must be an object that contains at least a 'uid' key which contains a string identifying the user
 * @param callback
 */
export function handleAuthStateChange(callback: (userAuth: any) => void) {
  fire.fireAuth.onAuthStateChanged((auth) => callback(auth));
}

/**
 * -- REQUIRED --
 * gets the user privilege for the currently authenticated user
 * returns a promise resolving with one of the following strings: ['Owner', 'Privilege', 'Admin', 'User']
 */
export function getUserPrivilege(): Promise<any> {
  return fire.fireStore
    .collection("Users")
    .doc(fire.fireAuth.currentUser?.uid)
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
 * -- Required --
 * initializes the datastore Users collection listener
 *
 * if the current user is an 'Owner' or 'Admin', the entire users collection is synced to the redux store
 * if the current user is 'Power' or 'User' only the current user document is synced to the redux store
 */
export function initializeUsersListener() {
  getUserPrivilege().then((privilege) => {
    if (["Owner", "Admin"].includes(privilege as string)) {
      // listen to entire users collection
      fire.fireStore.collection("Users").onSnapshot((querySnapshot) => {
        var users: any = {};
        querySnapshot.forEach((doc) => {
          users[doc.id] = doc.data();
        });
        // call reducer to store each site
        store.dispatch(updateUsersSlice.actions.updateUsers(users));
      });
    } else {
      // listen only to current user document
      fire.fireStore
        .collection("Users")
        .doc(fire.fireAuth.currentUser?.uid)
        .onSnapshot((doc) => {
          var users: any = {};
          users[doc.id] = doc.data();
          // call reducer to store each site
          store.dispatch(updateUsersSlice.actions.updateUsers(users));
        });
    }
  });
}

/**
 * -- required --
 * initializes the Channel Templates collection listener
 * syncs all channel telmplates to the redux store
 */
export function initializeChannelTemplatesListener() {
  console.log("initializing channel templates listener");
  fire.fireStore.collection("ChannelTemplates").onSnapshot((querySnapshot) => {
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

/**
 * -- required --
 *
 * initializes sites listener
 * syncs all site documents to the redux store
 */
export function initializeSitesListener() {
  console.log("initializing sites listener");
  fire.fireStore.collection("Sites").onSnapshot((querySnapshot) => {
    var sites: any = {};
    querySnapshot.forEach((doc) => {
      sites[doc.id] = doc.data();
    });
    // call reducer to store each site
    store.dispatch(sitesSlice.actions.updateSites(sites));
  });
}

/**
 * -- Required --
 * creates a new site document in the datastore
 */
export function createNewSite() {
  fire.fireStore
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

/**
 * -- Required --
 * Sends the authorization email (via the password reset template)
 * @param address address to reset
 */
export function sendAuthorizationEmail(address: string) {
  fire.fireAuth
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
 * -- Required --
 * Creates an email document which will be later sent to admins and then deleted
 * @param email string
 * @param message string
 * @param subject string
 */
export function createEmailDocument(
  email: string,
  message: string,
  subject: string
) {
  fire.fireStore.collection("Emails").add({
    email: email,
    subject: subject,
    message: message,
  });
}

/**
 * -- Required --
 * Creates the user document associated with accounts
 * @param uid string
 * @param email string
 * @param userGroup string
 */
export function createUserDocument(
  uid: string,
  email: string,
  userGroup: string
) {
  fire.fireStore.collection("Users").doc(uid).set({
    defaults: true,
    email: email,
    phoneNumber: null,
    userGroup: userGroup,
  });
}

/**
 * -- Required --
 * attemps to sign in the user
 * @param email string
 * @param password string
 *
 * returns a promise that resolves with the successfully signed in user document (this document may contain any information but MUST contain a 'uid' key with the unique id for the user)
 */
export function signInWithEmail(email: string, password: string): Promise<any> {
  return fire.fireAuth
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
 * -- Required --
 * signs out the current user
 * returns a promise that resolves without arguments
 */
export function fireAuthSignOut(): Promise<any> {
  return fire.fireAuth.signOut().then(() => {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  });
}

/**
 * -- Required --
 * Fetches the User document specified
 * @param uid string
 *
 * returns a promise that resolves with the user document
 */
export function getUserData(uid: string): Promise<any> {
  return fire.fireStore
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
 * -- Required --
 * Changes the password for the logged in user
 * @param newPassword
 * returns a promise resolved with nothing
 */
export function changePassword(newPassword: string): Promise<any> | undefined {
  return fire.fireAuth.currentUser?.updatePassword(newPassword).then(
    () => {
      // Update successful.
      return fire.fireStore
        .collection("Users")
        .doc(fire.fireAuth.currentUser?.uid)
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
 * -- Required --
 * creates new equpiment associated with the specified site and given an initial name
 * @param site_uid string
 * @param equipment_name string
 */
export function createNewEquipment(site_uid: string, equipment_name: string) {
  const newEquipment: EquipmentUnit = {
    faults: [],
    loggers: [],
    name: equipment_name,
    health: "Unknown",
    type: "Unassigned",
  };

  fire.fireStore
    .collection("Sites")
    .doc(site_uid)
    .update({ equipmentUnits: fire.arrayUnion(newEquipment) });
}
