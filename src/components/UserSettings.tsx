/**
 * Author: Brendan Ortmann
 */

import React, { useState } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
} from 'reactstrap';
import '../assets/styles.scss';
import '../assets/bootstrap.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { Link, Redirect } from 'react-router-dom';
import { deleteUser, fireAuthSignOut, updateUserDoc } from 'scripts/Datastore';
import Content from './Content';

export default function Settings() {
    const uid = useSelector((state: RootState) => state.auth.userUID);
    const currentUser = useSelector(
        (state: RootState) => state.users[uid as string]
    );

    const [newVals, setNewVals] = useState({
        email: '',
        phoneNumber: '',
        emailNotifications: currentUser?.emailNotifications ?? true,
        smsNotifications: currentUser?.smsNotifications ?? true,
    });

    const [accountDeleted, setAccountDeleted] = useState(false);

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

    const printVals = (e: any) => {
        e.preventDefault();
        console.log(newVals);
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
            // setAccountDeleted(true);
        }
    };

    return accountDeleted ? (
        <Redirect push to="/" />
    ) : (
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
                                    placeholder={
                                        currentUser?.phoneNumber
                                            ? currentUser?.phoneNumber
                                            : ''
                                    }
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
