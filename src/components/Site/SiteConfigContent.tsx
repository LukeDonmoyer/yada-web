import React, { ReactElement, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { SiteContentProps } from "./Sites";

import "../../assets/styles.scss";
import "../../assets/bootstrap.scss";
import { updateSiteConfig } from "scripts/Implementation";
import { SiteObject } from "store/FirestoreInterfaces";

interface configTabProps {
  site: SiteObject,
  siteId: string
}

export default function ConfigTab({ site, siteId }: configTabProps): ReactElement {
  const [configState, setConfigState] = useState({
    name: site.name,
    notes: site.notes,
    address: site.address
  });

  const updateField = (e: any) => {
    setConfigState({
      ...configState,
      [e.target.name]: e.target.value
    });
  };

  const submitChanges = (e: any) => {
    e.preventDefault();
    updateSiteConfig(siteId, configState);
    alert("Changes saved!");
  };

  return (
    <div className="siteConfigTab">
      <Form onSubmit={submitChanges}>
        <div className="bootStrapStyles">
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder={configState.name}
              value={configState.name}
              onChange={updateField}
            />
          </FormGroup>
        </div>

        <div className="bootStrapStyles">
          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder={configState.address}
              value={configState.address}
              onChange={updateField}
            />
          </FormGroup>
        </div>

        <div className="bootStrapStyles">
          <FormGroup>
            <Label>Notes</Label>
            <Input
              type="textarea"
              name="notes"
              id="notes"
              placeholder={configState.notes}
              value={configState.notes}
              onChange={updateField}
            />
          </FormGroup>
        </div>

        <div className="bootStrapStyles">
          <FormGroup>
            <Label>Equipment Notifications</Label>
            <div>Equipment notification selection goes here.</div>
          </FormGroup>
        </div>

        <div>
          <Button type="submit" value="Submit">Save Changes</Button>
        </div>
      </Form>
    </div>
  );
}