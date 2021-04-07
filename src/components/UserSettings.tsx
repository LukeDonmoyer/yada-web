/**
 * User Settings component.
 *
 * Provides interface for changing account and notification settings.
 *
 * Author: Brendan Ortmann
 */

import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import {
    changePassword,
    deleteUser,
    fireAuthSignOut,
    updateUserDoc,
} from 'scripts/Datastore';
import { ToggleSwitch } from './Control/ToggleSwitch';

/**
 * Generates password reset form and associated logic.
 * @returns ReactElement containing password reset form
 */
function PasswordReset(): ReactElement {
    const handleResetPassword = (event: any) => {
        event.preventDefault(); // prevents default form submission
        const currentPassword = event.target[0].value;
        const password1 = event.target[1].value;
        const password2 = event.target[2].value;
        if (password1 !== password2) {
            alert('passwords must match');
        } else {
            changePassword(currentPassword, password1)?.then(
                () => {
                    alert('Your password has been changed');
                },
                () => {
                    alert(
                        'Your password change was not successful. If you do not remember your old password you will need to request a password reset email from the onboard page'
                    );
                }
            );
        }
    };

    return (
        <div className="userSettings">
            <div className="resetPasswordForm">
                <form onSubmit={handleResetPassword}>
                    <FormGroup className="inputGroup">
                        <Label for="currentPassword">Current password</Label>
                        <Input
                            required
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            placeholder="current password"
                        />
                    </FormGroup>
                    <FormGroup className="inputGroup">
                        <Label for="password">New Password</Label>
                        <Input
                            required
                            type="password"
                            name="password"
                            id="password"
                            placeholder="new password"
                        />
                    </FormGroup>
                    <FormGroup className="inputGroup">
                        <Label for="confirmPassword">Confirm Password</Label>
                        <Input
                            required
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="confirm password"
                        />
                    </FormGroup>
                    <div className="buttonsContainer">
                        <div className="pad"></div>
                        <div className="buttons">
                            <Button type="submit" value="Submit">
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Settings(): ReactElement {
    // Current user info
    const uid = useSelector((state: RootState) => state.auth.userUID);
    const currentUser = useSelector(
        (state: RootState) => state.users[uid as string]
    );
    const [updatedUI, changeUpdatedUI] = useState(false);

    // New settings values
    const [newVals, setNewVals] = useState({
        email: currentUser?.email ? currentUser?.email : '',
        phoneNumber: currentUser?.phoneNumber ? currentUser?.phoneNumber : '',
    });

    if (currentUser !== undefined && !updatedUI) {
        setNewVals({
            ...newVals,
            email: currentUser?.email ? currentUser?.email : '',
            phoneNumber: currentUser?.phoneNumber
                ? currentUser?.phoneNumber
                : '',
        });
        changeUpdatedUI(true);
    }

    const updateField = (event: any) => {
        setNewVals({
            ...newVals,
            [event.target.name]: event.target.value,
        });
    };

    const submitChanges = (event: any) => {
        event.preventDefault();
        updateUserDoc(uid as string, newVals);
        alert('Changes saved!');
    };

    const toggleNotification = (key: string, state: Boolean) => {
        updateUserDoc(uid as string, { [key]: state });
    };

    const deleteAccount = (event: any) => {
        event.preventDefault();
        let deleteAccount = window.confirm(
            'Do you really wish to delete your account?'
        );
        if (deleteAccount) {
            deleteUser(uid as string);
            alert('Account deleted.');
            fireAuthSignOut();
        }
    };

    return (
        <div className="userSettings">
            <h1>User Settings</h1>
            <div className="formContainer">
                <div className="left">
                    <Form onSubmit={submitChanges}>
                        <div>
                            <FormGroup className="inputGroup">
                                <Label for="email">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder={currentUser?.email}
                                    value={newVals.email}
                                    onChange={updateField}
                                />
                            </FormGroup>
                            <FormGroup className="inputGroup">
                                <Label for="phoneNumber">Phone Number</Label>
                                <Input
                                    required
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder={newVals.phoneNumber}
                                    value={newVals.phoneNumber}
                                    onChange={updateField}
                                />
                            </FormGroup>
                        </div>

                        <div className="buttonsContainer">
                            <div className="pad"></div>
                            <div className="buttons">
                                <Button className="primaryBtn">
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={deleteAccount}
                                    className="deleteBtn"
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>

                        <FormGroup check className="checkGroup">
                            <Label for="emailNotifications" check>
                                Email Notifications
                            </Label>
                            <div className="checkBoxContainer">
                                <ToggleSwitch
                                    enabledDefault={
                                        currentUser?.emailNotifications ?? true
                                    } // this field is ignored by the toggle switch component because we are passing in the enabled state
                                    enabled={
                                        currentUser?.emailNotifications ?? true
                                    }
                                    onEnable={() => {
                                        toggleNotification(
                                            'emailNotifications',
                                            true
                                        );
                                    }}
                                    onDisable={() => {
                                        toggleNotification(
                                            'emailNotifications',
                                            false
                                        );
                                    }}
                                />
                            </div>
                        </FormGroup>
                        <FormGroup check className="checkGroup">
                            <Label for="smsNotifications" check>
                                SMS Notifications
                            </Label>

                            <div className="checkBoxContainer">
                                <ToggleSwitch
                                    enabledDefault={
                                        currentUser?.smsNotifications ?? true
                                    } // this field is ignored since we are passing in the enabled state
                                    enabled={
                                        currentUser?.smsNotifications ?? true
                                    }
                                    onEnable={() => {
                                        toggleNotification(
                                            'smsNotifications',
                                            true
                                        );
                                    }}
                                    onDisable={() => {
                                        toggleNotification(
                                            'smsNotifications',
                                            false
                                        );
                                    }}
                                />
                            </div>
                        </FormGroup>
                    </Form>
                </div>
                <div className="right">
                    <PasswordReset />
                </div>
            </div>
        </div>
    );
}
