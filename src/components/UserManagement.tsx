/**
 * Dashboard component
 *
 * route: '/app/usermanagement'
 * purpose: page that will provide access to manage users
 */

import {
    deleteUser,
    editEmail,
    editPhoneNumber,
    editPrivilege,
    getUserPrivilege,
    registerUser,
} from '../scripts/Datastore';
import AuthCheck from './Control/AuthCheck';
import { ReactElement, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { User } from 'store/FirestoreInterfaces';
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import Button, { ButtonType } from './Control/Button';
import pencilIcon from './../assets/icons/pencil.svg';

//Default number of items to display per datagrid page.
const DEFAULT_PAGE_LIMIT = 12;

interface PrivilegeToggleProps {
    // name of privilege level
    level: string;
    // user id
    uid: string;
}

interface ToggleItemProps {
    // user id
    uid: string;
    // current level of the user
    currentLevel: string;
    // level for this toggle item
    level: string;
}

/**
 * renders privilege toggle item
 */
function ToggleItem(props: ToggleItemProps) {
    return (
        <span
            onClick={() => {
                editPrivilege(props.uid, props.level);
            }}
            className={`${
                props.currentLevel === props.level ? 'selected' : 'deselected'
            }`}
        >
            {props.level}
        </span>
    );
}

/**
 * renders privilege toggle
 */
function PrivilegeToggle(props: PrivilegeToggleProps) {
    return (
        <div className="privilegeToggle">
            <ToggleItem
                uid={props.uid}
                level={'Admin'}
                currentLevel={props.level}
            />
            <ToggleItem
                uid={props.uid}
                level={'Power'}
                currentLevel={props.level}
            />
            <ToggleItem
                uid={props.uid}
                level={'User'}
                currentLevel={props.level}
            />
        </div>
    );
}

interface accountControlsProps {
    uid: string;
    email: string;
}

function AccountControls(props: accountControlsProps) {
    return (
        <div className={`accountControls`}>
            <span
                className="delete"
                onClick={() => {
                    if (window.confirm(`Delete user: ${props.email}`)) {
                        deleteUser(props.uid);
                    }
                }}
            >
                delete
            </span>
        </div>
    );
}

/**
 * renders user management table
 */
export default function UserManagement(): ReactElement {
    const [authorized, setAuthorization] = useState(false);
    const users = useSelector((state: RootState) => state.users);
    const userID = useSelector((state: RootState) => state.auth.userUID);

    getUserPrivilege().then((privilege) => {
        if (privilege === 'Owner' || privilege === 'Admin') {
            setAuthorization(true);
        }
    });

    // prompts user for email and then registers the email
    function promptForEmail() {
        let result = prompt(
            "Enter the email address for the account you'd like registered",
            'email@somewhere'
        );
        registerUser(result as string);
    }

    const phoneNumberColumn = {
        name: 'phone',
        header: 'Phone Number',
        defaultFlex: 2,
        rendersInlineEditor: true,
        render: ({ value }: any, { cellProps }: any) => {
            let v = cellProps.editProps.inEdit
                ? cellProps.editProps.value
                : value;
            return (
                <div className="tableEditable">
                    <img src={pencilIcon} alt="editable" />
                    <input
                        className="phoneColumn"
                        type="text"
                        autoFocus={cellProps.inEdit}
                        value={v}
                        onBlur={(e) => {
                            cellProps.editProps.onComplete();
                        }}
                        onChange={cellProps.editProps.onChange}
                        onFocus={() => cellProps.editProps.startEdit()}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                cellProps.editProps.onCancel(e);
                            }
                            if (e.key === 'Enter') {
                                cellProps.editProps.onComplete(e);
                            }
                            if (e.key == 'Tab') {
                                e.preventDefault();
                                cellProps.editProps.onTabNavigation(
                                    true,
                                    e.shiftKey ? -1 : 1
                                );
                            }
                        }}
                    />
                </div>
            );
        },
    };

    const columns = [
        {
            name: 'email',
            header: <b>Email Address</b>,
            defaultFlex: 2,
            editable: false,
        },
        phoneNumberColumn,
        {
            name: 'privileges',
            header: 'Privileges',
            editable: false,
            defaultFlex: 2,
        },
        {
            name: 'controls',
            header: 'Caution',
            defaultFlex: 1,
            editable: false,
        },
    ];

    let data: any = [];

    // adds row to data for each user in the system
    for (const [uid, user] of Object.entries(users)) {
        let userData = user as User;
        let phoneNumber = userData.phoneNumber;
        if (phoneNumber == null) {
            phoneNumber = '';
        }
        if (
            userData.userGroup !== 'Owner' &&
            uid !== userID &&
            !userData.disabled
        ) {
            data.push({
                email: userData.email,
                phone: phoneNumber,
                privileges: (
                    <PrivilegeToggle level={userData.userGroup} uid={uid} />
                ),
                uniqueId: uid,
                controls: <AccountControls uid={uid} email={userData.email} />,
            });
        }
    }

    // callback for editing a phone number cell (email is an option but is disabled for this implementation with firestore)
    const onEditComplete = (info: TypeEditInfo) => {
        switch (info.columnId) {
            case 'phone': {
                editPhoneNumber(info.rowId, info.value);
                break;
            }
            case 'email': {
                editEmail(info.rowId, info.value);
                break;
            }
        }
    };

    return (
        <div className="userManagement w-full">
            {authorized ? (
                <>
                    <h1>User Management</h1>
                    <Button
                        align={'right'}
                        type={ButtonType.tableControl}
                        text={'+'}
                        onClick={promptForEmail}
                    />
                    <ReactDataGrid
                        className={'dataGrid'}
                        idProperty="uniqueId"
                        columns={columns}
                        dataSource={data}
                        editable={true}
                        onEditComplete={onEditComplete}
                        pagination={true}
                        defaultLimit={DEFAULT_PAGE_LIMIT}
                    />
                </>
            ) : (
                <AuthCheck
                    additionalMessage={
                        'You do not have proper authentication for this page. Please log in as an admin, or contact your admin for access.'
                    }
                />
            )}
        </div>
    );
}
