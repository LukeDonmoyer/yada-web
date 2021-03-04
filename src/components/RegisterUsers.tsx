/**
 * RegisterUsers component
 * author: Shaun Jorstad
 *
 * route: '/registerUsers'
 * access: Owners exclusively
 *
 * purpose: gui with a table and a plus button to add rows to the table. Any email input into the table will be given an account. Currently all accounts are created with User level permissions but can be extended in the future to have a userGroup selection
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';
import {
    createUserDocument,
    getUserData,
    sendAuthorizationEmail,
} from 'scripts/Datastore';
import { registerUser } from 'scripts/FireAdmin';
import '../assets/styles.scss';
import { RootState } from '../store/rootReducer';
import AuthCheck from './AuthCheck';
import { Animated } from 'react-animated-css';

export default function RegisterUsers() {
    // number of forms to display
    const [numForms, setForms]: [number, any] = useState(0);
    // emails edited by the user
    const [emails, setEmails]: [string[], any] = useState([]);

    // increases the number of forms to display
    function addForm() {
        setForms(numForms + 1);
    }

    /**
     * onChange handler for the input fields to update the emails stored in the state
     * @param index index of the input field
     * @param newValue updated string in the input field
     */
    function updateEmail(index: number, newValue: string) {
        let oldEmails = [...emails];
        oldEmails[index] = newValue;
        setEmails(oldEmails);
    }

    // current user id
    const currentUser = useSelector((state: RootState) => state.auth.userUID);
    const history = useHistory();

    // if no user is logged in, they are redirected home
    if (!(currentUser === null || currentUser === undefined)) {
        getUserData(currentUser).then((data) => {
            // if the logged in user is not an Owner they are redirected to the dashboard
            if (data.userGroup === 'Power' || data.userGroup === 'User') {
                alert(
                    'innappropriate permissions. Please log in as administrator.'
                );
                history.push('/app/dashboard');
            }
        });
    } else {
        return <AuthCheck />;
        // history.push("/?redirect=registerUsers");
    }

    /**
     * creates an account for every email in the table then redirects to the dashboard
     */
    function registerUsers() {
        emails.forEach((email) => {
            // authorizes the email for logon with the default password
            registerUser(email).then((user) => {
                // creates the user document
                createUserDocument(user.user.uid, user.user.email, 'User');
                sendAuthorizationEmail(user.user.email);
            });
        });
        alert('Users were registered and will receive an email');
    }

    return (
        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <div className="h-screen registerUsers">
                <div className="card">
                    <h1>Register users</h1>
                    <div className="userForms">
                        <h2 className="float-left">Emails:</h2>
                        <div onClick={addForm} className="addEmailButton">
                            +
                        </div>
                        <div className="registerUsersTable">
                            {Array.from({ length: numForms }, (x, i) => i).map(
                                (i) => (
                                    <input
                                        key={i}
                                        onChange={(event) => {
                                            updateEmail(i, event.target.value);
                                        }}
                                        className="simpleInput"
                                        type="email"
                                        placeholder="email"
                                    />
                                )
                            )}
                        </div>
                        <div
                            className="registerUsersButton"
                            onClick={registerUsers}
                        >
                            register and email
                        </div>
                        <Link to="/app/dashboard">
                            <div className="dashboardLink">
                                --go to dashboard--
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Animated>
    );
}
