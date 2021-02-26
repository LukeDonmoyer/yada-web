/**
 * Author: Brendan Ortmann
 */

import React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Content from "./Content";
import "../assets/styles.scss";
import "../assets/bootstrap.scss";

/**
 * Use uncontrolled React form components.
 * Default form values set based on Redux state.
 * OnChange function parses form changes, calls Firestore functions.
 * Firestore changes will be reflected in Redux state,
 * but changes to state should NOT cause more rendering.
 */

export default function UserSettings() {
  return (
    // TODO: Wrap in Content component
    <div className="userSettings bootStrapStyles">
      <h1>User Settings: </h1>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="with a placeholder"
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
          <Row>
            <Label for="emailNotifications" check>
              <Input type="checkbox" id="emailNotifications" /> Email
              Notifications
            </Label>
            <Label for="smsNotifications" check>
              <Input type="checkbox" id="smsNotifications" /> SMS Notifications
            </Label>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Button className="saveChanges">Save Changes</Button>
          </Row>
          <Row>
            <Button className="deleteAccount">Delete Account</Button>
          </Row>
        </FormGroup>
      </Form>
    </div>
  );
}
