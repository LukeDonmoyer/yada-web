/**
 * Firestore connection for all non-administrative firestore queries
 * author: Shaun Jorstad
 *
 */
import firebase from 'firebase';
import 'firebase/auth';
const firebaseConfig = {
    apiKey: 'AIzaSyBTZqNRnrfcgfRjE3SvPiqtDVsADFNXIxM',
    authDomain: 'yada-comp451.firebaseapp.com',
    databaseURL: 'https://yada-comp451.firebaseio.com',
    projectId: 'yada-comp451',
    storageBucket: 'yada-comp451.appspot.com',
    messagingSenderId: '584848197896',
    appId: '1:584848197896:web:9b75a59a06ca70ccb844bd',
    measurementId: 'G-RDWW2L2ERC',
};

var fireInstance = firebase.initializeApp(firebaseConfig);
export var fireStore = fireInstance.firestore();
export var fireAuth = firebase.auth();

// useful firestore functions that will be used later in development
export function fireIncrement(val: number) {
    return firebase.firestore.FieldValue.increment(val);
}
export function fireDecrement(val: number) {
    return firebase.firestore.FieldValue.increment(val);
}
export let fireDelete = firebase.firestore.FieldValue.delete;
export let Timestamp = firebase.firestore.Timestamp;
export let arrayUnion = firebase.firestore.FieldValue.arrayUnion;
