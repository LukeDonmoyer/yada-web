import React, { ReactElement, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { SiteContentProps } from './Sites';

import "../../assets/styles.scss";
import "../../assets/bootstrap.scss";
import { updateSiteConfig } from "scripts/Datastore";
import { EquipmentUnit, SiteObject } from "store/FirestoreInterfaces";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";

interface configTabProps {
    site: SiteObject;
    siteId: string;
}

function createEquipmentElements(equipment: EquipmentUnit[]): ReactElement[]{
  let equipmentList: ReactElement[] = [];

  equipment.forEach(e => {
    equipmentList.push(
      <div className="grid grid-cols-2 gap-4">
        <div>
          {e.name}
        </div>
        <div>
          <Input
            type="checkbox"  
          />
        </div>
      </div>
    );
  });

  return equipmentList;
}

export default function ConfigTab({ site, siteId }: configTabProps): ReactElement {
    const uid = useSelector((state: RootState) => state.auth.userUID);

    const [configState, setConfigState] = useState({
      name: site.name,
      notes: site.notes,
      address: site.address
    });

    const updateField = (e: any) => {
        setConfigState({
            ...configState,
            [e.target.name]: e.target.value,
        });
    };

    const submitChanges = (e: any) => {
        e.preventDefault();
        updateSiteConfig(siteId, configState);
        alert('Changes saved!');
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
                    <div>
                      {createEquipmentElements(site.equipmentUnits)}
                    </div>
                  </FormGroup>
                </div>

                <div>
                    <Button type="submit" value="Submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
