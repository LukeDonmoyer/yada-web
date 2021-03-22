import { ReactElement } from 'react';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';

interface ChannelTemplateContentProps {
    template: ChannelTemplate;
}

export default function ChannelTemplateContent({
    template,
}: ChannelTemplateContentProps): ReactElement {
    return <h1>{template.name}</h1>;
}
