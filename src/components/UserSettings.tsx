/**
 * Author: Brendan Ortmann
 */

import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Content from "./Content";
import "../assets/styles.scss";
import "../assets/bootstrap.scss";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { Link, Redirect } from "react-router-dom";
import { User } from "store/FirestoreInterfaces";
import { current } from "@reduxjs/toolkit";
import { deleteUser, updateUserDoc } from "scripts/UserSettingsFunctions";

/**
 * Use uncontrolled React form components.
 * Default form values set based on Redux state.
 * OnChange function parses form changes, calls Firestore functions.
 * Firestore changes will be reflected in Redux state,
 * but changes to state should NOT cause more rendering.
 */

export default function UserSettings() {
  const uid = useSelector((state: RootState) => state.auth.userUID);
  const currentUser = useSelector((state: RootState) => state.users[uid as string]);

  const [newVals, setNewVals] = useState({
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    emailNotifications: (currentUser.emailNotifications ?? true),
    smsNotifications: (currentUser.smsNotifications ?? true)
  });

  const [accountDeleted, setAccountDeleted] = useState(false);

  const updateField = (e: any) => {
    setNewVals({
      ...newVals,
      [e.target.name]: e.target.value
    });
  };

  const updateCheckbox = (e: any) => {
    setNewVals({
      ...newVals,
      [e.target.name]: e.target.checked
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
    alert("Changes saved!");
  };

  const deleteAccount = (event: any) => {
    event.preventDefault();
    let deleteAccount = window.confirm("Do you really wish to delete your account?");
    if(deleteAccount){
      deleteUser(uid as string);
      alert("Account deleted.");
      setAccountDeleted(true);
    }
  }

  return accountDeleted ? (
    <Redirect push to="/"/>
  ) : (
    <div className="userSettings bootStrapStyles">
      <h1>User Settings: </h1>
      <Form onSubmit={submitChanges} className="py-8">
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder={newVals.email}
            value={newVals.email}
            onChange={updateField}
          />
          <Label for="phoneNumber">Phone Number</Label>
          <Input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder={newVals.phoneNumber}
            value={newVals.phoneNumber}
            onChange={updateField}
          />
        </FormGroup>
        <FormGroup check>
          <Label for="emailNotifications" check>
            <Input 
              type="checkbox" 
              id="emailNotifications" 
              name="emailNotifications" 
              checked={newVals.emailNotifications}
              onChange={updateCheckbox}
            />
            Email Notifications
          </Label>
          <Label for="smsNotifications" check>
            <Input 
              type="checkbox" 
              id="smsNotifications" 
              name="smsNotifications"
              checked={newVals.smsNotifications}
              onChange={updateCheckbox}
            />
            SMS Notifications
          </Label>
        </FormGroup>
        <FormGroup>
          <Link to="/change-password">Change Password</Link>
          <Button>Save Changes</Button>
          <Button onClick={deleteAccount}>Delete Account</Button>
        </FormGroup>
      </Form>
    </div>
  );
}
