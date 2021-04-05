import { ReactElement, useState } from 'react';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import Button, { ButtonType } from '../Control/Button';
import Modal from '../Control/Modal';

function addScript() {}

interface ChannelListProps {
    // The template object to get data from.
    template: ChannelTemplate;
}

export default function ChannelList({
    template,
}: ChannelListProps): ReactElement {
    let [addingScript, setAddingScript] = useState(false);

    function createRows(channels: Map<string, string>) {
        const rows: ReactElement[] = [];
        let counter = 1;

        for (let [key, value] of Object.entries(channels)) {
            rows.push(
                <ChannelRow
                    name={key}
                    scriptFile={value}
                    keys={template.keys}
                    index={counter++}
                />
            );
        }

        return rows;
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
                    {createRows(template.channels)}
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
                                value={'new'}
                                checked
                            />
                            <label className={'marginAfter'} htmlFor={'new'}>
                                Upload New
                            </label>
                            <input
                                type={'radio'}
                                id={'existing'}
                                name={'newOrExisting'}
                                value={'existing'}
                            />
                            <label
                                className={'marginAfter'}
                                htmlFor={'existing'}
                            >
                                Use Existing
                            </label>
                        </div>
                        <input
                            type={'file'}
                            name={'scriptFile'}
                            id={'scriptFile'}
                            hidden
                        />
                        <label
                            className={'uploadButton horizontal'}
                            htmlFor={'scriptFile'}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                            </svg>
                            No file uploaded
                        </label>
                    </div>
                    <div className={'inputSection'}>
                        <h2>Script Name:</h2>
                        <input
                            className={'scriptName'}
                            type={'text'}
                            name={'scriptName'}
                        />
                    </div>
                </div>
                <div className={'modalButtons horizontal'}>
                    <Button
                        type={ButtonType.tableControl}
                        text={'Done'}
                        onClick={() => {
                            addScript();
                            setAddingScript(false);
                        }}
                    />
                    <Button
                        type={ButtonType.warning}
                        text={'Cancel'}
                        onClick={() => setAddingScript(false)}
                    />
                </div>
            </Modal>
        </>
    );
}

interface ChannelRowProps {
    name: string;
    scriptFile: string;
    index: number;
    keys: Map<string, string>;
}

function ChannelRow({
    name,
    scriptFile,
    keys,
    index,
}: ChannelRowProps): ReactElement {
    const [expanded, setExpanded] = useState(false);

    function createKeys(keys: Map<string, string>) {
        const result: { name: string; type: string }[] = [];
        for (let [key, value] of Object.entries(keys)) {
            result.push({ name: key, type: value });
        }

        return result;
    }

    function addValue() {
        console.log('Add value');
    }

    return (
        <>
            <div className={`row ${index % 2 === 0 ? 'highlight' : ''}`}>
                <div className={'column'}>
                    <div className={''}>
                        {expanded ? (
                            <svg
                                onClick={() => setExpanded(!expanded)}
                                viewBox="0 0 24 24"
                            >
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </svg>
                        ) : (
                            <svg
                                onClick={() => setExpanded(!expanded)}
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        )}
                        {name}
                    </div>
                </div>
                <div className={'column'}>{scriptFile}</div>
                <svg className={'delete'} viewBox="0 0 24 24">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
            </div>
            <div className={`${index % 2 === 0 ? 'highlight' : ''}`}>
                <div className={`${expanded ? 'expandable' : 'hidden'}`}>
                    <div className={'row'}>
                        <div className={'column'}>
                            <h2>Value Name</h2>
                        </div>
                        <div className={'column rightAlign'}>
                            <h2>Value Type</h2>
                        </div>
                    </div>
                    {createKeys(keys).map(({ name, type }) => (
                        <KeyType name={name} type={type} />
                    ))}
                    <div className={'row'}>
                        <svg
                            className={'plusButton'}
                            viewBox="0 0 24 24"
                            onClick={addValue}
                        >
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}

interface KeyTypeProps {
    name: string;
    type: string;
}

function KeyType({ name, type }: KeyTypeProps): ReactElement {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(type);

    function createDropDownItem(name: string): ReactElement {
        return (
            <DropdownItem
                onClick={() => {
                    setSelectedType(name);
                    //TODO: replace with setting channel type
                }}
            >
                {name}
            </DropdownItem>
        );
    }

    return (
        <div className={'row'}>
            <div className={'column'}>
                <div>{name}</div>
            </div>
            <div className={'column'}>
                <div className={'bootStrapStyles'}>
                    <Dropdown
                        className={'fixedWidth'}
                        isOpen={dropDownOpen}
                        toggle={() => setDropDownOpen(!dropDownOpen)}
                    >
                        <DropdownToggle caret>{selectedType}</DropdownToggle>
                        <DropdownMenu>
                            {['boolean', 'string', 'number', 'date'].map(
                                createDropDownItem
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}
