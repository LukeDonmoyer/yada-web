/**
 * Contains the functions to generate the Site configuration tab.
 *
 * Author: Brendan Ortmann
 */

import React, { ReactElement, useState } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Label,
    Button as ReactButton,
} from 'reactstrap';
import Button, { ButtonType } from 'components/Control/Button';

// import 'assets/styles.scss';
// import 'assets/bootstrap.scss';
import {
    updateSiteConfig,
    updateEquipmentNotification,
    deleteSite,
} from 'scripts/Datastore';
import { EquipmentUnit, SiteObject } from 'store/FirestoreInterfaces';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { ToggleSwitch } from 'components/Control/ToggleSwitch';
import { useHistory } from 'react-router-dom';
import PrivilegeAssert from 'components/Control/PrivilegeAssert';
import { isValidName } from 'scripts/DataValidation';

interface configTabProps {
    site: SiteObject;
    siteId: string;
}

/**
 * Enumerates equipment with corresponding checkboxes and state
 * @param equipment is an array of EquipmentUnits
 * @param updateState is the function by which we update the state for the corresponding EquipmentUnit
 * @param state is the current state
 * @param notificationMap is a map containing the *changes* to the existing notification state
 * @returns a ReactElement array containing each row of equipment and corresponding checkbox
 */
function createEquipmentElements(
    equipment: EquipmentUnit[],
    uid: string,
    siteId: string,
    notificationMap: {
        [key: string]: boolean;
    }
): ReactElement[] {
    let equipmentList: ReactElement[] = [];
    equipment.forEach((e) => {
        equipmentList.push(
            <div className="notificationEntry" key={e.name}>
                <div className="name">{e.name}</div>
                <div className="toggle">
                    <ToggleSwitch
                        enabledDefault={notificationMap[e.name] ?? false}
                        enabled={notificationMap[e.name] ?? false}
                        onEnable={() => {
                            updateEquipmentNotification(
                                uid,
                                siteId,
                                e.name,
                                true
                            );
                        }}
                        onDisable={() => {
                            updateEquipmentNotification(
                                uid,
                                siteId,
                                e.name,
                                false
                            );
                        }}
                    />
                </div>
            </div>
        );
    });

    return equipmentList;
}

/**
 * Renders the Site Configuration Tab
 * @param param0 is an object containing the props for the Config tab
 * @returns React element for site configuration tab
 */
export default function ConfigTab({
    site,
    siteId,
}: configTabProps): ReactElement {
    const uid = useSelector((state: RootState) => state.auth.userUID);
    const notificationMap =
        useSelector(
            (state: RootState) =>
                state.users[uid as string]?.equipmentNotifications?.[siteId]
        ) ?? {};
    const history = useHistory(); // necessary to redirect after deleting the site

    const [configState, setConfigState] = useState({
        name: site.name,
        notes: site.notes,
        address: site.address,
    });

    const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.id === 'name' && !isValidName(event.currentTarget.value)) {
            if (event.currentTarget.value === '') {
                alert('A blank name will not be accepted');
            } else {
                alert(
                    'Invalid input: the name of a site must only contain alphabetical characters, numbers, spaces, and dashes'
                );
                return;
            }
        }
        setConfigState({
            ...configState,
            [event.currentTarget.name]: event.currentTarget.value,
        });
    };

    const submitChanges = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValidName(configState.name)) {
            alert(
                'Invalid input: the name of a site must only contain alphabetical characters, numbers, spaces, and dashes'
            );
            return;
        }
        updateSiteConfig(siteId, configState);
        alert('Changes saved!');
    };

    return (
        <div className="siteConfigTab">
            <Form onSubmit={submitChanges}>
                <PrivilegeAssert requiredPrivilege="Power">
                    <FormGroup className="formGroup">
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

                    <FormGroup className="formGroup">
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

                    <FormGroup className="formGroup">
                        <Label>Notes</Label>
                        <Input
                            type="textarea"
                            name="notes"
                            id="notes"
                            className="text"
                            placeholder={configState.notes}
                            value={configState.notes}
                            onChange={updateField}
                        />
                    </FormGroup>
                    <div className="buttonContainer">
                        <div className="pad"></div>
                        <div className="buttons">
                            <ReactButton type="submit" value="Submit">
                                Save
                            </ReactButton>
                            <Button
                                type={ButtonType.warningSecondary}
                                text="Delete"
                                onClick={() => {
                                    if (window.confirm('Delete this site')) {
                                        history.push('/app/sites');
                                        deleteSite(siteId);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </PrivilegeAssert>

                <div className="notificationSection">
                    <h2>Equipment Notifications</h2>
                    <div>
                        {createEquipmentElements(
                            site.equipmentUnits,
                            uid as string,
                            siteId as string,
                            notificationMap
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}
