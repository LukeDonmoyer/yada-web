"""
Firestore Setup
---------------

This script initializes all the Firestore collections necessary for YADA to function.

USAGE: python3 firestoreSetup.py <PATH_TO_SERVICE_ACCOUNT_KEY_FILE>

This script contains the following functions:

    * registerUser() - Creates a new user document based on user input.
    * createCollections() - Initializes all the collections 
"""

import json
import firebase_admin
import sys
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth
from getpass import getpass

def registerUser():
    """
    Creates a new user document from user input.
    """

    emailAddress = input("emailAddress: ")
    phoneNumber = input("phoneNumber: ")
    userPassword = getpass("password: ")
    userName = input("username: ")
    userRights = input("user group: [O]Owner, [A]Admin, [P]Power, [U]User")

    while userRights not in ['O', 'o', 'A', 'a', 'P', 'p', 'U', 'u']:
        userRights = input(
            "user group: [O]Owner, [A]Admin, [P]Power, [U]User:  ")

    if userRights in ['o', 'O']:
        userRights = 'Owner'
    if userRights in ['A', 'a']:
        userRights = 'Admin'
    if userRights in ['P', 'p']:
        userRights = 'Power'
    if userRights in ['U', 'u']:
        userRights == 'User'

    user = auth.create_user(
        email=emailAddress,
        email_verified=False,
        password=userPassword,
        display_name=userName,
        disabled=False)
    print('Sucessfully created new user: {0}'.format(user.uid))

    doc = {
        u'email': emailAddress,
        u'phoneNumber': phoneNumber,
        u'userGroup': userRights,
        u'defaults': True
    }

    db.collection('Users').document(user.uid).set(doc)

def createCollections():
    """
    Creates all the necessary collections for YADA with the default admin account.

    NOTE: all collections except Config and Users are created with a document stub that contains only one field, since empty documents are automatically removed by Firestore.
    """

    # Empty document stub
    doc = {u'name': ""}
    # Collections
    collections = ['ChannelTemplates', 'Config', 'Loggers', 'Sites', 'Users']

    for c in collections:
        if c == 'Config':
            print("CONFIGURATION")
            # Get user input for config fields
            orgName = input("Organization name: ")
            ownerEmail = input("Owner's email address: ")
            defaultPass = getpass("Default user password: ")
            while len(defaultPass) < 6:
                print("Default password must be at least 6 characters!")
                defaultPass = input("Default user password: ")

            # Create dict object based on input
            data = {
                u'defaultUserPassword': defaultPass,
                u'orgName': orgName,
                u'ownerEmail': ownerEmail
            }

            # Add dict to collection
            db.collection(c).document(u'config').set(data)

            # Write dict to file
            with open('config.json', 'w') as f:
                json.dump(data, f, indent=4, sort_keys=True)

        elif c == 'Users':
            print("DATABASE OWNER ACCOUNT:")
            registerUser()
        else:
            db.collection(c).document(u'stub').set(doc)  # Create document
            # Remove it from collection
            db.collection(c).document(u'stub').delete()

        print("Setup complete.")


# Check for appropriate command line arguments
if len(sys.argv) < 2:
    print(__doc__)
    sys.exit()

# Use the application default credentials
jsonKey = json.load(open(sys.argv[1]))
cred = credentials.Certificate(jsonKey)
app = firebase_admin.initialize_app(cred)

db = firestore.client()
createCollections()