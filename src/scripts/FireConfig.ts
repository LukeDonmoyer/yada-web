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
import {EquipmentUnit, SiteObject} from "store/FirestoreInterfaces";
import { firestoreConnect } from "react-redux-firebase";
import sitesSlice from "store/SiteActions";

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

//TODO: Move to Implementation
export function addLoggerToEquipment(site_uid: string, equipment_name: string, logger_uid: string){
  fireStore.collection("Sites").doc(site_uid).get().then((doc) => {
    if(doc.exists){
      var site = doc.data() as SiteObject;

      var equipmentIndex = site.equipmentUnits.findIndex(unit => unit.name === equipment_name);

      if(equipmentIndex != -1) site.equipmentUnits[equipmentIndex].loggers.push(logger_uid);

      fireStore.collection("Sites").doc(site_uid).update(site);

      console.log('Added logger "' + logger_uid + '" to equipment "' + equipment_name + '"');
    }
  });
}

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
