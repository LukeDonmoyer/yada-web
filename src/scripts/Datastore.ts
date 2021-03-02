/**
 * This script contains every datastore query used by the application. These functions will need to be modified when the system is implemented to work with whatever database is being used. The specific function requirements are documented. Any changes to these function arguments and return types will require additional changes in the source code.
 */

import updateChannelTemplatesSlice from "store/ChannelTemplateActions";
import store from "store/store";
import updateUsersSlice from "store/UserAction";
import * as implementation from "./Implementation";

// AUTHENTICATION
/**
 * Registers the handler which updates the redux store when the authenticated user changes.
 *
 * the authObject can be any object that contains a 'uid' key conatining the user ID
 * @param callback the callback function that executes anytime the authenticated user changes. This function modifies the redux store to update the ui
 */
export function registerAuthChangeCallback(callback: (userAuth: any) => void) {
  implementation.handleAuthStateChange(callback);
}

/**
 * TODO: finish
 */
export function getUserPrivilege(): Promise<any> {
  return implementation.getUserPrivilege();
}

// REDUX HANDLERS
// TODO: finish
export function initializeListeners() {
  implementation.initializeChannelTemplatesListener();
  implementation.initializeSitesListener();
  implementation.initializeUsersListener();
}

/**
 * TODO: finish this
 */
export function resetRedux() {
  store.dispatch(updateUsersSlice.actions.updateUsers({}));
  store.dispatch(updateUsersSlice.actions.updateUsers({}));
  store.dispatch(
    updateChannelTemplatesSlice.actions.updateChannelTemplates({})
  );
}

/**
 * TODO: finish this
 */
export function createNewSite() {
  implementation.createNewSite();
}

/**
 * TODO: finish this
 * @param address
 */
export function sendAuthorizationEmail(address: string) {
  implementation.sendAuthorizationEmail(address);
}

/**
 * TODO: finish this
 * Creates an email document which will be later sent to admins and then deleted
 * @param email
 * @param message
 */
export function createEmailDocument(
  email: string,
  message: string,
  subject: string
) {
  implementation.createEmailDocument(email, message, subject);
}

/**
 * TODO: finish
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
  implementation.createUserDocument(uid, email, userGroup);
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
  return implementation.signInWithEmail(email, password);
}

/**
 * TODO: complete
 * signs out the current user
 * returns a promise that resolves without arguments
 */
export function fireAuthSignOut(): Promise<any> {
  return implementation.fireAuthSignOut();
}

/**
 * TODO: finish
 * Fetches the User document specified
 * @param uid
 *
 * returns a promise that resolves with the user document
 */
export function getUserData(uid: string): Promise<any> {
  return implementation.getUserData(uid);
}

/**
 * TODO: finish
 * Changes the password for the logged in user
 * @param newPassword
 * returns a promise resolved with nothing
 */
export function changePassword(newPassword: string): Promise<any> | undefined {
  return implementation.changePassword(newPassword);
}
