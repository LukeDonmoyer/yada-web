import React, { ReactElement, useEffect, useState } from 'react';
import {
    Channel,
    ChannelTemplate,
    Script,
} from 'store/FirestoreInterfaces';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import Button, { ButtonType } from 'components/Control/Button';
import Modal from 'components/Control/Modal';
import {
    addScriptToTemplate,
    getScriptList,
    removeKeyFromChannel,
    removeScriptFromTemplate,
    updateKeyInChannel,
    uploadScript,
} from 'scripts/Datastore';
import ChannelRow from 'components/ChannelTemplate/ChannelRow';

interface ChannelListProps {
    // The template object to get data from.
    template: ChannelTemplate;

    // The id of the template
    templateId: string;
}

const UPLOAD_KEY = 'upload';
const EXISTING_KEY = 'existing';

/**
 * Component that displays a table of channels inside a template.
 *
 * @constructor
 */
export default function ChannelList({
    templateId,
    template,
}: ChannelListProps): ReactElement {
    let [addingScript, setAddingScript] = useState(false);
    let [file, setFile] = useState<File | undefined>(undefined);
    let [scriptType, setScriptType] = useState(UPLOAD_KEY);
    let [dropdownOpen, setDropdownOpen] = useState(false);
    let [selectedScript, setSelectedScript] = useState<null | Script>(null);
    let [scripts, setScripts] = useState<undefined | Script[]>(undefined);
    let [scriptName, setScriptName] = useState<undefined | string>();

    // Gets scripts from database
    useEffect(() => {
        getScriptList().then(setScripts);
    }, []);

    let scriptTypeChangeHandler = (
        event: React.MouseEvent<HTMLInputElement>
    ) => {
        setScriptType(event.currentTarget.value);
    };

    function hideAddScriptModal() {
        setAddingScript(false);
        setScriptName(undefined);
        setScriptType(UPLOAD_KEY);
    }

    function addScript() {
        let filename = undefined;

        if (scriptType === UPLOAD_KEY && file) {
            uploadScript(file);
            filename = file.name;
        } else if (scriptType === EXISTING_KEY && selectedScript) {
            filename = selectedScript.name;
        }

        if (!filename || !scriptName) return;

        addScriptToTemplate(templateId, {
            name: scriptName,
            script: filename,
            keys: {},
        });
    }

    function createDropDownItem(script: Script): ReactElement {
        return (
            <DropdownItem
                onClick={() => {
                    setSelectedScript(script);
                }}
            >
                {script.name}
            </DropdownItem>
        );
    }

    function createRow(channel: Channel, index: number) {
        return (
            <ChannelRow
                channel={channel}
                index={index}
                templateId={templateId}
            />
        );
    }

    return (
        <>
            <div className={'scriptTable'}>
                <div className={'row headerHighlight'}>
                    <div className={'column'}>
                        <div className={'headerAlign'}>
                            <h2>Channel Name</h2>
                        </div>
                    </div>
                    <div className={'column'}>
                        <h2>Script</h2>
                    </div>
                    <div
                        className={'addScript'}
                        onClick={() => setAddingScript(true)}
                    >
                        +
                    </div>
                </div>
                <div className={'scrollable'}>
                    {template.channels &&
                        Object.values(template.channels).map(createRow)}
                </div>
            </div>
            <Modal
                show={addingScript}
                onClickOutside={() => setAddingScript(false)}
            >
                <div className={'content'}>
                    <div className={'inputSection'}>
                        <div className={'horizontal'}>
                            <h2 className={'marginAfter'}>Script File:</h2>
                            <input
                                type={'radio'}
                                id={'new'}
                                name={'newOrExisting'}
                                value={'upload'}
                                onClick={scriptTypeChangeHandler}
                                checked={scriptType === UPLOAD_KEY}
                            />
                            <label className={'marginAfter'} htmlFor={'new'}>
                                Upload New
                            </label>
                            <input
                                type={'radio'}
                                id={'existing'}
                                name={'newOrExisting'}
                                value={EXISTING_KEY}
                                onClick={scriptTypeChangeHandler}
                                checked={scriptType === EXISTING_KEY}
                            />
                            <label
                                className={'marginAfter'}
                                htmlFor={'existing'}
                            >
                                Use Existing
                            </label>
                        </div>
                        {scriptType === EXISTING_KEY ? (
                            <div className={'bootStrapStyles'}>
                                <Dropdown
                                    className={'fixedWidth'}
                                    isOpen={dropdownOpen}
                                    toggle={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                >
                                    <DropdownToggle caret>
                                        {selectedScript?.name}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {scripts?.map(createDropDownItem)}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        ) : (
                            <>
                                <input
                                    type={'file'}
                                    name={'scriptFile'}
                                    id={'scriptFile'}
                                    onChange={(event) =>
                                        setFile(event.currentTarget.files?.[0])
                                    }
                                    hidden
                                />
                                <label
                                    className={'uploadButton horizontal'}
                                    htmlFor={'scriptFile'}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                                    </svg>
                                    {file ? file.name : 'No file uploaded'}
                                </label>
                            </>
                        )}
                    </div>
                    <div className={'inputSection'}>
                        <h2>Script Name:</h2>
                        <input
                            className={'scriptName'}
                            type={'text'}
                            name={'scriptName'}
                            onChange={(event) =>
                                setScriptName(event.currentTarget.value)
                            }
                        />
                    </div>
                </div>
                <div className={'modalButtons horizontal'}>
                    <Button
                        type={ButtonType.tableControl}
                        text={'Done'}
                        onClick={() => {
                            addScript();
                            hideAddScriptModal();
                        }}
                    />
                    <Button
                        type={ButtonType.warning}
                        text={'Cancel'}
                        onClick={hideAddScriptModal}
                    />
                </div>
            </Modal>
        </>
    );
}
