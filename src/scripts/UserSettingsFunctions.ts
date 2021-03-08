/**
 * Author: Brendan Ortmann
 *
 * Collection of functions to update User settings.
 */

import { fireAuth, fireStore } from 'scripts/FireConfig';

/**
 *
 * @param uid
 */
export function deleteUser(uid: string) {
    fireAuth.currentUser?.delete();
    fireStore.collection('Users').doc(uid).delete();
}

/**
 *
 * @param uid
 * @param newVals
 */
export function updateUserDoc(uid: string, newVals: any) {
    fireStore.collection('Users').doc(uid).set(newVals, { merge: true });
    if ('email' in newVals) fireAuth.currentUser?.updateEmail(newVals.email);
}
