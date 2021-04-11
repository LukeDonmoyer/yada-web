import { Channel } from '../../store/FirestoreInterfaces';
import React, { ReactElement, useState } from 'react';
import {
    removeScriptFromTemplate,
    updateKeyInChannel,
} from '../../scripts/Datastore';
import Modal from '../Control/Modal';
import Button, { ButtonType } from '../Control/Button';
import TypeDropdown from './TypeDropdown';
import KeyType from './KeyType';

interface ChannelRowProps {
    // The channel to display.
    channel: Channel;

    // The index of the current row.
    index: number;

    // The id of this channel's template.
    templateId: string;
}

/**
 * Creates a row for the channel table.
 *
 * @constructor
 */
export default function ChannelRow({
    channel,
    index,
    templateId,
}: ChannelRowProps): ReactElement {
    const [expanded, setExpanded] = useState(false);
    const [addingValue, setAddingValue] = useState(false);
    const [keyName, setKeyName] = useState<null | string>(null);
    const [keyType, setKeyType] = useState<null | string>(null);

    function createKeys(keys: { [key: string]: string }) {
        const result: { name: string; type: string }[] = [];
        for (let [key, value] of Object.entries(keys)) {
            result.push({ name: key, type: value });
        }

        return result;
    }

    function addValue(keyName: string, keyType: string) {
        updateKeyInChannel(templateId, channel, keyName, keyType);
    }

    function handleModalDone() {
        setAddingValue(false);

        if (!keyName || !keyType) return;
        addValue(keyName, keyType);
    }

    function openModal() {
        setAddingValue(true);
    }

    function closeModal() {
        setAddingValue(false);
    }

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    function setValueFromInput(
        setter: (x: string) => void
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (event) => setter(event.currentTarget.value);
    }

    return (
        <>
            <Modal show={addingValue} onClickOutside={closeModal}>
                <div className={'content'}>
                    <div className={'inputSection'}>
                        <h2>Key Name:</h2>
                        <input
                            type={'text'}
                            name={'keyName'}
                            id={'keyName'}
                            onChange={setValueFromInput(setKeyName)}
                        />
                    </div>
                    <div className={'inputSection'}>
                        <h2>Type:</h2>
                        <TypeDropdown
                            value={'boolean'}
                            onValueSelected={setKeyType}
                        />
                    </div>
                </div>
                <div className={'modalButtons horizontal'}>
                    <Button
                        type={ButtonType.tableControl}
                        text={'Done'}
                        onClick={handleModalDone}
                    />
                    <Button
                        type={ButtonType.warning}
                        text={'Cancel'}
                        onClick={closeModal}
                    />
                </div>
            </Modal>
            <div className={`row ${index % 2 === 0 ? 'highlight' : ''}`}>
                <div className={'column'}>
                    <div>
                        {expanded ? (
                            <svg onClick={toggleExpanded} viewBox="0 0 24 24">
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </svg>
                        ) : (
                            <svg onClick={toggleExpanded} viewBox="0 0 24 24">
                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        )}
                        {channel.name}
                    </div>
                </div>
                <div className={'column'}>{channel.script}</div>
                <svg
                    className={'delete'}
                    viewBox="0 0 24 24"
                    onClick={() =>
                        removeScriptFromTemplate(templateId, channel)
                    }
                >
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
                    {createKeys(channel.keys).map(({ name, type }) => (
                        <KeyType
                            templateId={templateId}
                            channel={channel}
                            name={name}
                            type={type}
                        />
                    ))}
                    <div className={'row'}>
                        <svg
                            className={'plusButton'}
                            viewBox="0 0 24 24"
                            onClick={openModal}
                        >
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}
