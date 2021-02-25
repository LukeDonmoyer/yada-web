/**
 * Author: Brendan Ortmann
 */

import React from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import Content from "./Content";

/**
 * Use uncontrolled React form components.
 * Default form values set based on Redux state.
 * OnChange function parses form changes, calls Firestore functions.
 * Firestore changes will be reflected in Redux state,
 * but changes to state should NOT cause more rendering.
 */

export default function UserSettings() {
  return (
    <Content
      head={
        <div className="userSettings">
          <h1>User Settings: </h1>
        </div>
      }
      body={
        <div className="userSettings">
          <Form>
            <FormGroup check>
              <Label for="emailNotifications" check>
                <Input type="checkbox" id="emailNotifications" /> Email
                Notifications
              </Label>
              <Label for="smsNotifications" check>
                <Input type="checkbox" id="smsNotifications" /> SMS
                Notifications
              </Label>
            </FormGroup>
          </Form>
        </div>
      }
    />
  );
}
