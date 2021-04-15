import { Channel } from 'store/FirestoreInterfaces';
import React, { ReactElement } from 'react';
import {
    removeKeyFromChannel,
    updateKeyInChannel,
} from 'scripts/Datastore';
import TypeDropdown from './TypeDropdown';

interface KeyTypeProps {
    // The id of the template this channel belongs to.
    templateId: string;

    // The channel this key type belongs to.
    channel: Channel;

    // The key name.
    name: string;

    // The type associated with this key.
    type: string;
}

/**
 * Component for display a key and its type.
 *
 * @constructor
 */
export default function KeyType({
    templateId,
    channel,
    name,
    type,
}: KeyTypeProps): ReactElement {
    return (
        <div className={'row'}>
            <div className={'column'}>
                <div>{name}</div>
            </div>
            <div className={'column'}>
                <TypeDropdown
                    value={type}
                    onValueSelected={(value) =>
                        updateKeyInChannel(templateId, channel, name, value)
                    }
                />
            </div>
            <svg
                className={'delete'}
                viewBox="0 0 24 24"
                onClick={() => removeKeyFromChannel(templateId, channel, name)}
            >
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
        </div>
    );
}
