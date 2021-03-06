/**
 * Author: Brendan Ortmann
 *
 * Collection of functions to update User settings.
 */

import { fireStore, getUserData } from "scripts/FireConfig";

/**
 *
 * @param uid
 */
export function deleteUser(uid: string) {
  fireStore.collection("Users").doc(uid).delete();
}

/**
 *
 * @param uid
 * @param setting
 * @param value
 */
export function updateNotifications(
  uid: string,
  setting: string,
  value: boolean
) {
  fireStore.collection("Users").doc(uid).update({ setting: value });
}

/**
 *
 * @param uid
 * @param newNumber
 */
export function updatePhoneNumber(uid: string, newNumber: string) {
  fireStore.collection("Users").doc(uid).update({ phoneNumber: newNumber });
}

export function updateUserDoc(uid: string, newVals: object) {
  fireStore.collection("Users").doc(uid).set(newVals, {merge: true});
}