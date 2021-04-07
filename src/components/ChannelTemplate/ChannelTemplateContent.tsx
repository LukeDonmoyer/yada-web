import React, { ReactElement } from 'react';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';
import ChannelList from './ChannelList';

interface ChannelTemplateContentProps {
    // The template object to get data from.
    template: ChannelTemplate;
}

export default function ChannelTemplateContent({
    template,
}: ChannelTemplateContentProps): ReactElement {
    return (
        <div className={'channelTemplate'}>
            <h1>{template.name}</h1>
            <ChannelList template={template} />
        </div>
    );
}
