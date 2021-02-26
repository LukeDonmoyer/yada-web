/**
 * Implementation of the required database scripts to support this application. This implementation uses Firestore as the datastore
 */
import { fireAuth } from "./FireConfig";

/**
 * handles user auth state cahnges. the callback must be called whenever the authenticated user changes. The userAuth parameter to the callback function must be an object that contains at least a 'uid' key which contains a string identifying the user
 * @param callback
 */
export function handleAuthStateChange(callback: (userAuth: any) => void) {
  fireAuth.onAuthStateChanged((auth) => callback(auth));
}
