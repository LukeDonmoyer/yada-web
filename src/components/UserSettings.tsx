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
    phoneNum: currentUser.phoneNumber,
    emailNotifications: (currentUser.emailNotifications ?? true),
    smsNotifications: (currentUser.smsNotifications ?? true)
  });

  /**
   * Handles state changes on the page.
   * @param func is the function which updates the associated stateful value.
   */
   function handleEvent(func: any) {
    return (event: any) => {
      // event.preventDefault();
      func(event.target.value);
    };
  }

  return (
    <div className="userSettings bootStrapStyles">
      <h1>User Settings: </h1>
      <Form>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder={newVals.email}
            value={newVals.email}
            onChange={handleEvent(setNewVals)}
          />
          <Label for="phoneNum">Password</Label>
          <Input
            type="tel"
            name="phoneNum"
            id="phoneNum"
            placeholder={newVals.phoneNum}
            value={newVals.phoneNum}
            onChange={handleEvent(setNewVals)}
          />
        </FormGroup>
        <FormGroup check>
          <Label for="emailNotifications" check>
            <Input 
              type="checkbox" 
              id="emailNotifications" 
              name="emailNotifications" 
              checked={newVals.emailNotifications}
              onChange={handleEvent(setNewVals)}
            />
            Email Notifications
          </Label>
          <Label for="smsNotifications" check>
            <Input 
              type="checkbox" 
              id="smsNotifications" 
              name="smsNotifications"
              checked={newVals.smsNotifications}
              onChange={handleEvent(setNewVals)}
            />
            SMS Notifications
          </Label>
        </FormGroup>
        <FormGroup>
          <Link to="/change-password">Change Password</Link>
          <Button>Save Changes</Button>
          <Button>Delete Account</Button>
        </FormGroup>
      </Form>
    </div>
  );
}
