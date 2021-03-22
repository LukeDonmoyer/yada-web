import React, { FormEvent, ReactElement, useState } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Label,
    Button as ReactButton,
} from 'reactstrap';
import Button, { ButtonType } from '../Control/Button';

// import '../../assets/styles.scss';
// import '../../assets/bootstrap.scss';
import {
    updateSiteConfig,
    updateEquipmentNotification,
    deleteSite,
} from 'scripts/Datastore';
import { EquipmentUnit, SiteObject } from 'store/FirestoreInterfaces';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { ToggleSwitch } from 'components/Control/ToggleSwitch';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';

interface configTabProps {
    site: SiteObject;
    siteId: string;
}

/**
 * Enumerates equipment with corresponding checkboxes and state
 * @param equipment
 * @param uid
 * @param siteId
 * @param notificationMap
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
 *
 * @param param0
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
    const history = useHistory(); // necessary to redirect after site delection

    const [configState, setConfigState] = useState({
        name: site.name,
        notes: site.notes,
        address: site.address,
    });

    const updateField = (e: any) => {
        setConfigState({
            ...configState,
            [e.currentTarget.name]: e.currentTarget.value,
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
