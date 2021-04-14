/**
 * implementation of datastore functionality. All functions must be completed for the app to function. Functions marked as 'REQUIRED' need to be implemented, and must accept the specified arguments and return the specified return values. Any auxiliary functions may be written as necessary
 */
import updateChannelTemplatesSlice from 'store/ChannelTemplateActions';
import {
    Channel,
    ChannelKeys,
    ChannelTemplate,
    EquipmentUnit,
    Script,
    SiteObject,
} from 'store/FirestoreInterfaces';
import sitesSlice from 'store/SiteActions';
import store from 'store/store';
import updateUsersSlice from 'store/UserAction';
import { adminAuth } from './FireAdmin';
import updateLoggersSlice from 'store/LoggerAction';
import * as fire from './FireConfig';
import firebase from 'firebase';
import authSlice, { authPayload } from 'store/FireActions';

/**
 * -- REQUIRED --
 * handles user auth state cahnges. the callback must be called whenever the authenticated user changes. The userAuth parameter to the callback function must be an object that contains at least a 'uid' key which contains a string identifying the user
 * @param callback
 */
export function handleAuthStateChange(callback: (userAuth: any) => void) {
    fire.fireAuth.onAuthStateChanged((auth) => {
        if (auth === null || auth === undefined) {
            callback(auth);
        } else {
            fire.fireStore
                .collection('Users')
                .doc(auth.uid)
                .get()
                .then((docSnapshot) => {
                    let data = docSnapshot.data();
                    if (!data!.disabled) {
                        callback(auth);
                    }
                });
        }
    });
}

/**
 * -- REQUIRED --
 * gets the user privilege for the currently authenticated user
 * returns a promise resolving with one of the following strings: ['Owner', 'Privilege', 'Admin', 'User']
 */
export function getUserPrivilege(): Promise<any> {
    return fire.fireStore
        .collection('Users')
        .doc(fire.fireAuth.currentUser?.uid)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                return new Promise((resolve, reject) => {
                    resolve(doc.data()?.userGroup);
                });
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
            }
        })
        .catch(function (error) {
            console.log('Error getting document:', error);
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
        if (['Owner', 'Admin'].includes(privilege as string)) {
            // listen to entire users collection
            fire.fireStore.collection('Users').onSnapshot((querySnapshot) => {
                let users: any = {};
                querySnapshot.forEach((doc) => {
                    users[doc.id] = doc.data();
                });
                // call reducer to store each site
                store.dispatch(updateUsersSlice.actions.updateUsers(users));
                let userPayload = {
                    userUID: fire.fireAuth.currentUser?.uid,
                    privilege:
                        users[fire.fireAuth.currentUser?.uid as string][
                            'userGroup'
                        ],
                } as authPayload;
                store.dispatch(authSlice.actions.login(userPayload));
            });
        } else {
            // listen only to current user document
            fire.fireStore
                .collection('Users')
                .doc(fire.fireAuth.currentUser?.uid)
                .onSnapshot((doc) => {
                    var users: any = {};
                    users[doc.id] = doc.data();
                    // call reducer to store each user
                    store.dispatch(updateUsersSlice.actions.updateUsers(users));
                    let userPayload = {
                        userUID: doc.id,
                        privilege: users[doc.id]['userGroup'],
                    } as authPayload;
                    store.dispatch(authSlice.actions.login(userPayload));
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
    console.log('initializing channel templates listener');
    fire.fireStore
        .collection('ChannelTemplates')
        .onSnapshot((querySnapshot) => {
            var templates: any = {};
            querySnapshot.forEach((doc) => {
                templates[doc.id] = doc.data();
            });
            // call reducer to store each site
            store.dispatch(
                updateChannelTemplatesSlice.actions.updateChannelTemplates(
                    templates
                )
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
    console.log('initializing sites listener');
    fire.fireStore.collection('Sites').onSnapshot((querySnapshot) => {
        var sites: any = {};
        querySnapshot.forEach((doc) => {
            sites[doc.id] = doc.data();
            if ('lastViewedFaults' in doc.data()) {
                sites[doc.id]['lastViewedFaults'] = sites[doc.id][
                    'lastViewedFaults'
                ]
                    ?.toDate()
                    .valueOf();
                console.log(sites[doc.id]['lastViewedFaults']);
            }
        });
        // call reducer to store each site
        store.dispatch(sitesSlice.actions.updateSites(sites));
    });
}

/**
 * -- required --
 *
 * initializes loggers listener
 * syncs all logger documents to the redux store
 */
export function initializeLoggersListener() {
    console.log('initializing loggers listener');
    fire.fireStore.collection('Loggers').onSnapshot((querySnapshot) => {
        var loggers: any = {};
        querySnapshot.forEach((doc) => {
            loggers[doc.id] = doc.data();
        });
        //call reducer to store each logger
        store.dispatch(updateLoggersSlice.actions.updateLoggers(loggers));
    });
}

/**
 * -- Required --
 * creates a new site document in the datastore
 */
export function createNewSite(name: string) {
    return () => fire.fireStore
                    .collection('Sites')
                    .add({
                        name: name,
                        notes: '',
                        address: '',
                        userNotifications: {},
                        equipmentUnits: [],
                    })
                    .then(() => {
                        console.log('Document successfully written!');
                    })
                    .catch((error) => {
                        console.error('Error writing document: ', error);
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
            console.log('email sent');
        })
        .catch(function (error) {
            // An error happened.
            console.log('email failed');
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
    fire.fireStore.collection('Emails').add({
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
    fire.fireStore.collection('Users').doc(uid).set({
        defaults: true,
        email: email,
        phoneNumber: null,
        userGroup: userGroup,
        disabled: false,
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
            let errorMessage = error.message;
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
        .collection('Users')
        .doc(uid)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                return new Promise((resolve, reject) => {
                    resolve(doc.data());
                });
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
                return new Promise((resolve, reject) => {
                    reject();
                });
            }
        })
        .catch(function (error) {
            console.log('Error getting document:', error);
        });
}

/**
 * -- Required --
 * Changes the password for the logged in user
 * @param newPassword
 * returns a promise resolved with nothing
 */
export function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<any> | undefined {
    return fire.fireAuth.currentUser
        ?.reauthenticateWithCredential(
            firebase.auth.EmailAuthProvider.credential(
                fire.fireAuth?.currentUser.email as string,
                currentPassword
            )
        )
        .then((credential) => {
            return fire.fireAuth.currentUser?.updatePassword(newPassword).then(
                () => {
                    // Update successful.
                    return fire.fireStore
                        .collection('Users')
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
        });
}

/**
 * -- Required --
 * creates new equipment associated with the specified site and given an initial name
 * @param site_uid string
 * @param equipment_name string
 */
export function createNewEquipment(site_uid: string, equipment_name: string) {
    const newEquipment: EquipmentUnit = {
        faults: [],
        loggers: [],
        name: equipment_name,
        health: 'Unknown',
        type: 'Unassigned',
    };

    fire.fireStore
        .collection('Sites')
        .doc(site_uid)
        .update({ equipmentUnits: fire.arrayUnion(newEquipment) });
}

/**
 * -- required --
 * edits a user's email
 * @param userID
 * @param email
 */
export function editEmail(userID: string, email: string) {
    fire.fireStore.collection('Users').doc(userID).update({
        email: email,
    });
}

/**
 * --Required --
 * edits a user's phone number
 */
export function editPhoneNumber(userid: string, number: string) {
    fire.fireStore.collection('Users').doc(userid).update({
        phoneNumber: number,
    });
}

/**
 *  -- Required --
 * edits a user's user group
 * @param userid
 * @param privilege must be one of ['Admin', 'Power', 'User']
 */
export function editPrivilege(userid: string, privilege: string) {
    fire.fireStore.collection('Users').doc(userid).update({
        userGroup: privilege,
    });
}

/**
 * -- Required --
 * disables user from logging in
 * @param userid
 */
export function deleteUser(userid: string) {
    fire.fireStore.collection('Users').doc(userid).update({
        disabled: true,
    });
}

/**
 * -- Required --
 * Disables the currently logged in account
 */
export function disableAccount(): Promise<any> {
    return fire.fireStore
        .collection('Users')
        .doc(fire.fireAuth.currentUser?.uid)
        .update({
            disabled: true,
        });
}

/**
 * -- required --
 * registers the email and default password for user
 * todo: send emails with information
 * @param userEmail email of the new user
 *
 * returns a promise that is resolved with the user authentication object
 */
export function registerUser(userEmail: string) {
    getUserPrivilege().then((privilege: string) => {
        if (['Owner', 'Admin'].includes(privilege)) {
            let createdUser = adminAuth.createUserWithEmailAndPassword(
                userEmail,
                'yadaDefault'
            ); // todo: this needs try catch
            createdUser.catch((error) => {
                console.log('error in creating user');
                fire.fireStore
                    .collection('Users')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.docs.forEach((doc) => {
                            if (doc.data().email === userEmail) {
                                fire.fireStore
                                    .collection('Users')
                                    .doc(doc.id)
                                    .update({ disabled: false });
                            }
                        });
                    });
            });
            createdUser
                .then((user) => {
                    let userData = user.user;
                    createUserDocument(userData!.uid, userEmail, 'User');
                    sendAuthorizationEmail(userEmail);
                })
                .catch((error) => {});
        } else {
            alert('innappropriate user permissions for this action');
        }
    });
}

/**
 * --REQUIRED--
 * Adds an existing logger to the specified equipment at the specified site.
 * @param site_uid string
 * @param equipment_name string
 * @param logger_uid string
 */
export function addLoggerToEquipment(
    site_uid: string,
    equipment_name: string,
    logger_uid: string
) {
    fire.fireStore
        .collection('Sites')
        .doc(site_uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let site = doc.data() as SiteObject;

                let equipmentIndex = site.equipmentUnits.findIndex(
                    (unit) => unit.name === equipment_name
                );

                if (equipmentIndex !== -1)
                    site.equipmentUnits[equipmentIndex].loggers.push(
                        logger_uid
                    );

                fire.fireStore.collection('Sites').doc(site_uid).update(site);

                fire.fireStore
                    .collection('Loggers')
                    .doc(logger_uid)
                    .set(
                        { equipment: equipment_name, site: site_uid },
                        { merge: true }
                    );

                console.log(
                    'Added logger "' +
                        logger_uid +
                        '" to equipment "' +
                        equipment_name +
                        '"'
                );
            }
        });
}

/**
 * --REQUIRED--
 * sends password reset email
 * @param email email
 */
export function sendPasswordResetEmail(email: string) {
    fire.fireAuth.sendPasswordResetEmail(email);
}

export function setLoggerChannelTemplate(
    logger_uid: string,
    template_uid: string
) {
    fire.fireStore
        .collection('Loggers')
        .doc(logger_uid)
        .set({ channelTemplate: template_uid }, { merge: true });
    console.log(
        'Set logger "' + logger_uid + '" with template "' + template_uid + '"'
    );
}

export function setLoggerIsCollectingData(
    logger_uid: string,
    isCollectingData: boolean
) {
    fire.fireStore
        .collection('Loggers')
        .doc(logger_uid)
        .set({ collectingData: isCollectingData }, { merge: true });
    console.log(
        'Set logger "' +
            logger_uid +
            '" is collecting data "' +
            isCollectingData +
            '"'
    );
}

export function removeLoggerFromEquipment(
    site_uid: string,
    logger_uid: string,
    equipment_name: string
) {
    fire.fireStore
        .collection('Sites')
        .doc(site_uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                var site = doc.data() as SiteObject;

                var equipmentIndex = site.equipmentUnits.findIndex(
                    (unit) => unit.name === equipment_name
                );

                if (equipmentIndex !== -1) {
                    var loggerIndex = site.equipmentUnits[
                        equipmentIndex
                    ].loggers.findIndex((uid) => uid === logger_uid);

                    if (loggerIndex !== -1)
                        site.equipmentUnits[equipmentIndex].loggers.splice(
                            loggerIndex,
                            1
                        );
                }

                fire.fireStore.collection('Sites').doc(site_uid).update(site);

                fire.fireStore
                    .collection('Loggers')
                    .doc(logger_uid)
                    .set({ equipment: null, site: null }, { merge: true });

                console.log(
                    'Removed logger "' +
                        logger_uid +
                        '" from equipment "' +
                        equipment_name +
                        '"'
                );
            }
        });
}

/**
 *
 * @param siteId
 * @param siteConfig
 */
export function updateSiteConfig(siteId: string, siteConfig: object) {
    fire.fireStore
        .collection('Sites')
        .doc(siteId)
        .set(siteConfig, { merge: true });
}

/**
 * -- Required --
 * updates the user document with the following settings
 * @param uid
 * @param newVals
 */
export function updateUserDoc(uid: string, newVals: any) {
    fire.fireStore.collection('Users').doc(uid).update(newVals);
    if ('email' in newVals)
        fire.fireAuth.currentUser?.updateEmail(newVals.email);
}

export function deleteEquipment(siteID: string, name: string) {
    fire.fireStore
        .collection('Sites')
        .doc(siteID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                let equipment = data?.equipmentUnits.filter((unit: any) => {
                    if (unit.name === name) {
                        unit.loggers.forEach((loggerID: string) => {
                            fire.fireStore
                                .collection('Loggers')
                                .doc(loggerID)
                                .update({
                                    equipment: null,
                                    site: null,
                                });
                        });
                    } else {
                        return unit;
                    }
                });
                fire.fireStore.collection('Sites').doc(siteID).update({
                    equipmentUnits: equipment,
                });
            }
        });
}

export function changeEquipmentName(
    siteID: string,
    oldName: string,
    newName: string
) {
    fire.fireStore
        .collection('Sites')
        .doc(siteID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                let equipment = data?.equipmentUnits.map((unit: any) => {
                    let tmp = unit;
                    if (unit.name === oldName) {
                        tmp.name = newName;
                        unit.loggers.forEach((loggerID: string) => {
                            fire.fireStore
                                .collection('Loggers')
                                .doc(loggerID)
                                .update({
                                    equipment: newName,
                                });
                        });
                    }
                    return tmp;
                });
                fire.fireStore.collection('Sites').doc(siteID).update({
                    equipmentUnits: equipment,
                });
            }
        });
}

/**
 * Updates the equipment notifications map in the user document specified by @param uid.
 * @param uid
 * @param siteId
 * @param notificationMap
 */
export function updateEquipmentNotifications(
    uid: string,
    siteId: string,
    notificationMap: object
) {
    fire.fireStore
        .collection('Users')
        .doc(uid)
        .set(
            {
                equipmentNotifications: {
                    [siteId]: notificationMap,
                },
            },
            { merge: true }
        );
}

export function getScriptList(): Promise<Script[]> {
    return fire.storage
        .ref('/ProfileScripts/Template')
        .listAll()
        .then((result) => {
            return result.items.map((ref) => {
                return {
                    name: ref.name,
                    fullPath: ref.fullPath,
                };
            });
        });
}

export function uploadScript(file: File) {
    fire.storage.ref(`/ProfileScripts/Template/${file.name}`).put(file);
}

export function addScriptToTemplate(templateId: string, channel: Channel) {
    fire.fireStore
        .collection('ChannelTemplates')
        .doc(templateId)
        .set(
            {
                channels: {
                    [channel.name]: channel,
                },
            },
            { merge: true }
        );
}

export function removeScriptFromTemplate(templateId: string, channel: Channel) {
    fire.fireStore
        .collection('ChannelTemplates')
        .doc(templateId)
        .set(
            {
                channels: {
                    [channel.name]: firebase.firestore.FieldValue.delete(),
                },
            },
            { merge: true }
        );
}

export function createNewTemplate(template: ChannelTemplate) {
    fire.fireStore.collection('ChannelTemplates').add(template);
}

export function deleteTemplate(templateId: string) {
    fire.fireStore.collection('ChannelTemplates').doc(templateId).delete();
}

export function updateTemplateModifiedDate(templateId: string, date: string) {
    fire.fireStore.collection('ChannelTemplates').doc(templateId).update({
        modified: date,
    });
}

export function updateKeyInChannel(
    templateId: string,
    channel: Channel,
    key: string,
    value: string
) {
    fire.fireStore
        .collection('ChannelTemplates')
        .doc(templateId)
        .update({
            [`channels.${channel.name}.keys.${key}`]: value,
        });
}

export function removeKeyFromChannel(
    templateId: string,
    channel: Channel,
    key: string
) {
    fire.fireStore
        .collection('ChannelTemplates')
        .doc(templateId)
        .update({
            [`channels.${channel.name}.keys.${key}`]: firebase.firestore.FieldValue.delete(),
        });
}

export function updateEquipmentNotification(
    uid: string,
    siteId: string,
    equipmentName: string,
    status: Boolean
) {
    fire.fireStore
        .collection('Users')
        .doc(uid)
        .update({
            [`equipmentNotifications.${siteId}.${equipmentName}`]: status,
        });
}

/**
 * Deletes a site. This will
 * - remove all logger data from loggers, and reset some logger attributes
 * - remove all notification information stored for the users
 * - remove the site from the datastore
 *
 * @param siteId site id to remove
 */
export function deleteSite(siteId: string) {
    // gets the list of loggers attatched to equipment
    fire.fireStore
        .collection('Sites')
        .doc(siteId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                // clears the logger data
                data?.equipmentUnits.forEach((unit: any) => {
                    unit.loggers.forEach((loggerId: string) => {
                        fire.fireStore
                            .collection('Loggers')
                            .doc(loggerId)
                            .update({
                                data: [],
                                collectingData: false,
                                faults: [],
                                site: null,
                                siteID: null,
                            });
                    });
                });
                // deletes the site
                fire.fireStore.collection('Sites').doc(siteId).delete();
            }
        });
    // remove site from user notifications
    fire.fireStore
        .collection('Users')
        .get()
        .then((docs) => {
            docs.forEach((doc) => {
                fire.fireStore
                    .collection('Users')
                    .doc(doc.id)
                    .update({
                        [`equipmentNotifications.${siteId}`]: fire.fireDelete(),
                    });
                console.log(doc.id);
            });
        });
}

export function updateSiteFaultsViewDate(siteId: string) {
    fire.fireStore.collection('Sites').doc(siteId).update({
        lastViewedFaults: firebase.firestore.FieldValue.serverTimestamp(),
    });
}
