/**
 * Author: Brendan Ortmann
 */

import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import '../assets/styles.scss';
import '../assets/bootstrap.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { Link, Redirect } from 'react-router-dom';
import { deleteUser, fireAuthSignOut, updateUserDoc } from 'scripts/Datastore';
import Content from './Content';
import AuthCheck from './AuthCheck';

export default function Settings() {
    const uid = useSelector((state: RootState) => state.auth.userUID);
    const currentUser = useSelector((state: RootState) => state.users[uid as string]);

    const [newVals, setNewVals] = useState({
        email: currentUser?.email ? currentUser?.email : "",
        phoneNumber: currentUser?.phoneNumber ? currentUser?.phoneNumber : "",
        emailNotifications: (currentUser?.emailNotifications ?? true),
        smsNotifications: (currentUser?.smsNotifications ?? true)
    });

    const updateField = (e: any) => {
        setNewVals({
            ...newVals,
            [e.target.name]: e.target.value,
        });
    };

    const updateCheckbox = (e: any) => {
        setNewVals({
            ...newVals,
            [e.target.name]: e.target.checked,
        });
    };

    const submitChanges = (event: any) => {
        event.preventDefault();
        console.log(newVals);
        updateUserDoc(uid as string, newVals);
        alert('Changes saved!');
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
            <Content
                head={<h1>User Settings</h1>}
                body={
                    <Form onSubmit={submitChanges}>
                        <div>
                            <FormGroup>
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
                            <FormGroup>
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
                        <div className="flex items-center">
                            <FormGroup check>
                                <Label for="emailNotifications" check>
                                    Email Notifications
                                </Label>
                                <Input
                                    type="checkbox"
                                    id="emailNotifications"
                                    name="emailNotifications"
                                    className="bootStrapStyles"
                                    checked={newVals.emailNotifications}
                                    onChange={updateCheckbox}
                                />
                            </FormGroup>
                        </div>
                        <div className="flex items-center">
                            <FormGroup check>
                                <Label for="smsNotifications" check>
                                    SMS Notifications
                                </Label>
                                <Input
                                    type="checkbox"
                                    id="smsNotifications"
                                    name="smsNotifications"
                                    className="bootStrapStyles"
                                    checked={newVals.smsNotifications}
                                    onChange={updateCheckbox}
                                />
                            </FormGroup>
                        </div>
                        <div className="flex justify-around items-center">
                            <Link to="/change-password" className="pswdLink">
                                Change Password
                            </Link>
                            <Button className="primaryBtn">Save Changes</Button>
                            <Button
                                onClick={deleteAccount}
                                className="deleteBtn"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </Form>
                }
            />
        </div>
    );
}
