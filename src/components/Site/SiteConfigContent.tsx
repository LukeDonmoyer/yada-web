import React, { FormEvent, ReactElement, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { SiteContentProps } from './Sites';

import "../../assets/styles.scss";
import "../../assets/bootstrap.scss";
import { updateSiteConfig, updateEquipmentNotifications } from "scripts/Datastore";
import { EquipmentUnit, SiteObject } from "store/FirestoreInterfaces";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";

interface configTabProps {
    site: SiteObject;
    siteId: string;
}

function createEquipmentElements(
  equipment: EquipmentUnit[], 
  updateState: React.Dispatch<React.SetStateAction<{}>>,
  state: {
    [key: string]: boolean
  },
  notificationMap: {
    [key: string]: boolean
  }
): ReactElement[] {
  let equipmentList: ReactElement[] = [];

  const createHandler = (name: string) => {
    return ((e: FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.checked != (notificationMap[name] ?? false)) {
        updateState({
          ...state,
          [name]: e.currentTarget.checked
        });
      } else {
        let newState = {...state};
        delete newState[name];
        updateState(newState);
      }
    });
  }

  equipment.forEach(e => {
    equipmentList.push(
      <div className="grid grid-cols-2 gap-4">
        <div>
          {e.name}
        </div>
        <div>
          <Input
            type="checkbox"
            checked={state[e.name] ?? notificationMap[e.name] ?? false}
            onChange={createHandler(e.name)}
          />
        </div>
      </div>
    );
  });

  return equipmentList;
}

export default function ConfigTab({ site, siteId }: configTabProps): ReactElement {
    const uid = useSelector((state: RootState) => state.auth.userUID);
    const notificationMap = useSelector(
      (state: RootState) => state.users[uid as string].equipmentNotifications?.[siteId]
    ) ?? {};

    const [configState, setConfigState] = useState({
      name: site.name,
      notes: site.notes,
      address: site.address
    });

    const [equipmentState, setEquipmentState] = useState({});

    const updateField = (e: any) => {
        setConfigState({
            ...configState,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    const submitChanges = (e: any) => {
        e.preventDefault();
        updateSiteConfig(siteId, configState);
        updateEquipmentNotifications(uid as string, siteId, equipmentState);
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

                <div className="">
                  <h2>Equipment Notifications</h2>
                  <div>
                    {createEquipmentElements(
                      site.equipmentUnits, 
                      setEquipmentState,
                      equipmentState,
                      notificationMap
                    )}
                  </div>
                </div>

                <div className="bootStrapStyles">
                    <Button type="submit" value="Submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
