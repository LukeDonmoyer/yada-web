/**
 * Author: Brendan Ortmann
 */

import React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Content from "./Content";
import "../assets/styles.scss";
import "../assets/bootstrap.scss";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { Link, Redirect } from "react-router-dom";

/**
 * Use uncontrolled React form components.
 * Default form values set based on Redux state.
 * OnChange function parses form changes, calls Firestore functions.
 * Firestore changes will be reflected in Redux state,
 * but changes to state should NOT cause more rendering.
 */

export default function UserSettings() {
  const uid = useSelector((state: RootState) => state.auth.userUID);

  // USE NULL COALESCENCE TO SET DEFAULT VALS IF SETTING DOESN'T EXIST

  return (
    // TODO: Wrap in Content component?
    <div className="userSettings bootStrapStyles">
      <h1>User Settings: </h1>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="email"
          />
          <Label for="examplePassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="password placeholder"
          />
        </FormGroup>
        <FormGroup check>
          <Label for="emailNotifications" check>
            <Input type="checkbox" id="emailNotifications" /> Email
            Notifications
          </Label>
          <Label for="smsNotifications" check>
            <Input type="checkbox" id="smsNotifications" /> SMS Notifications
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
