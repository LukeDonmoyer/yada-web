/**
 * This script contains every datastore query used by the application. These functions will need to be modified when the system is implemented to work with whatever database is being used. The specific function requirements are documented. Any changes to these function arguments and return types will require additional changes in the source code.
 */

// ------------------------------------------------
// ONLY EDIT THIS LINE
import * as implementation from './Implementation';
// ------------------------------------------------

import updateChannelTemplatesSlice from 'store/ChannelTemplateActions';
import store from 'store/store';
import updateUsersSlice from 'store/UserAction';

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
 * Fetches the privilege of the currently authenticated user.
 * Returns a promise that resolves with one of: ['Owner', 'Admin', 'Power', 'User']
 */
export function getUserPrivilege(): Promise<any> {
    return implementation.getUserPrivilege();
}

/**
 * initializes every datastore listener to sync datastore updates to the redux store
 */
export function initializeListeners() {
    implementation.initializeChannelTemplatesListener();
    implementation.initializeSitesListener();
    implementation.initializeUsersListener();
    implementation.initializeLoggersListener();
}

/**
 * clears the redux store (TODO: check to make sure this disconnects datastore listeners)
 */
export function resetRedux() {
    store.dispatch(updateUsersSlice.actions.updateUsers({}));
    store.dispatch(updateUsersSlice.actions.updateUsers({}));
    store.dispatch(
        updateChannelTemplatesSlice.actions.updateChannelTemplates({})
    );
}

/**
 * creates a new site in the datastore
 */
export function createNewSite() {
    implementation.createNewSite();
}

/**
 * creates new equipment
 * @param siteUID string
 * @param equipmentName string
 */
export function createNewEquipment(siteUID: string, equipmentName: string) {
    implementation.createNewEquipment(siteUID, equipmentName);
}

/**
 * sends authorization email to newly registered email
 * @param address
 */
export function sendAuthorizationEmail(address: string) {
    implementation.sendAuthorizationEmail(address);
}

/**
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
    implementation.createEmailDocument(email, message, subject);
}

/**
 * creates the user document to store info on the newly registered user
 * @param uid string
 * @param email string
 * @param userGroup string
 */
export function createUserDocument(
    uid: string,
    email: string,
    userGroup: string
) {
    implementation.createUserDocument(uid, email, userGroup);
}

/**
 * attemps to sign in the user
 * @param email string
 * @param password string
 *
 * returns a promise that resolves with the successfully signed in user document
 */
export function signInWithEmail(email: string, password: string): Promise<any> {
    return implementation.signInWithEmail(email, password);
}

/**
 * signs out the current user
 * returns a promise that resolves without arguments
 */
export function fireAuthSignOut(): Promise<any> {
    return implementation.fireAuthSignOut();
}

/**
 * Fetches the User document specified
 * @param uid string
 *
 * returns a promise that resolves with the user document
 */
export function getUserData(uid: string): Promise<any> {
    return implementation.getUserData(uid);
}

/**
 * Changes the password for the logged in user
 * @param newPassword string
 *
 * returns a promise that resolves with nothing
 */
export function changePassword(newPassword: string): Promise<any> | undefined {
    return implementation.changePassword(newPassword);
}
