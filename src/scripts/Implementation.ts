/**
 * Implementation of the required database scripts to support this application. This implementation uses Firestore as the datastore
 */
import updateChannelTemplatesSlice from "store/ChannelTemplateActions";
import sitesSlice from "store/SiteActions";
import store from "store/store";
import updateUsersSlice from "store/UserAction";
import * as fire from "./FireConfig";

/**
 * handles user auth state cahnges. the callback must be called whenever the authenticated user changes. The userAuth parameter to the callback function must be an object that contains at least a 'uid' key which contains a string identifying the user
 * @param callback
 */
export function handleAuthStateChange(callback: (userAuth: any) => void) {
  fire.fireAuth.onAuthStateChanged((auth) => callback(auth));
}

/**
 * returns a promise resolving with a string representing the current user's privilege
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
 * REDUX LISTENERS
 *
 * These listeners keep the redux store in sync with the data in the datastore
 */

// TODO: finish docs
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

// TODO: finish docs
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

// TODO: finish docs
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
 * TODO: finish
 * creates a new empty site document
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
 * TODO: finish this docs
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
 * Creates an email document which will be later sent to admins and then deleted
 * @param email
 * @param message
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
  fire.fireStore.collection("Users").doc(uid).set({
    defaults: true,
    email: email,
    phoneNumber: null,
    userGroup: userGroup,
  });
}

/**
 * TODO: complete
 * attemps to sign in the user
 * @param email
 * @param password
 *
 * returns a promise that resolves with the successfully signed in user document
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
 * TODO: finish
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
 * TODO: finish
 * Fetches the User document specified
 * @param uid
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
 * TODO: finish
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
