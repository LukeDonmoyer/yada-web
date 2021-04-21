import React, { ReactElement } from 'react';
import { ChannelTemplate } from 'store/FirestoreInterfaces';
import ChannelList from './ChannelList';
import Button, { ButtonType } from 'components/Control/Button';
import { deleteTemplate } from 'scripts/Datastore';
import { isTemplateFree } from 'scripts/Datastore';

interface ChannelTemplateContentProps {
    // The template object to get data from.
    template: ChannelTemplate;

    // The ID of the template
    templateId: string;
}

export default function ChannelTemplateContent({
    templateId,
    template,
}: ChannelTemplateContentProps): ReactElement {
    return (
        <div className={'channelTemplate'}>
            <h1>{template.name}</h1>
            <div className={'deleteButton'}>
                <Button
                    type={ButtonType.warning}
                    text={'Delete Template'}
                    onClick={() => {
                        isTemplateFree(templateId).then(
                            () => {
                                deleteTemplate(templateId);
                            },
                            (loggers) => {
                                alert(
                                    `Template is in use. Please remove from: ${loggers}`
                                );
                            }
                        );
                    }}
                />
            </div>
            <ChannelList template={template} templateId={templateId} />
        </div>
    );
}
