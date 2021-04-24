/**
 * Firestore administrative functions
 * author: Shaun Jorstad
 *
 * description: this creates a second connection to the firestore, which allows the owner accounts to authorize users via the '/registerUsers' route
 */
import firebase from 'firebase';
import 'firebase/auth';
import { getUserPrivilege } from 'scripts/Datastore';

const firebaseConfig = {
    apiKey: 'AIzaSyBTZqNRnrfcgfRjE3SvPiqtDVsADFNXIxM',
    authDomain: 'yada-comp451.firebaseapp.com',
    databaseURL: 'https://yada-comp451.firebaseio.com',
    projectId: 'yada-comp451',
    storageBucket: 'yada-comp451.appspot.com',
    messagingSenderId: '584848197896',
    appId: '1:584848197896:web:5bc77aad841c51c9b844bd',
    measurementId: 'G-CYXQ4Q1RG2',
};

let adminInstance = firebase.initializeApp(firebaseConfig, 'secondary');
export var adminAuth = adminInstance.auth();

/**
 * registers the email and default password for user
 * todo: send emails with information
 * @param userEmail email of the new user
 *
 * returns a promise that is resolved with the user authentication object
 */
export function registerUser(userEmail: string): Promise<any> {
    return getUserPrivilege().then((privilege: string) => {
        if (['Owner', 'Admin'].includes(privilege)) {
            return adminAuth
                .createUserWithEmailAndPassword(userEmail, 'yadaDefault')
                .then((user) => {
                    return new Promise((resolve) => {
                        resolve(user);
                    });
                });
        } else {
            alert('innappropriate user permissions for this action');
        }
    });
}
