/**
 * Dashboard component
 *
 * route: '/app/channel-templates'
 * purpose: page that will provide access to manage channel templates
 */

import React, { ReactElement, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import DynamicNavbar, {
    DynamicNavLink,
} from 'components/Control/DynamicNavbar';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { ChannelTemplate } from 'store/FirestoreInterfaces';
import ChannelTemplateContent from 'components/ChannelTemplate/ChannelTemplateContent';
import { createNewTemplate } from 'scripts/Datastore';
import Modal from 'components/Control/Modal';
import Button, { ButtonType } from 'components/Control/Button';
import moment from 'moment';

export const MODIFIED_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSSSS';

/**
 * Main container component for channel template pages.
 *
 * @constructor
 */
export default function ChannelTemplates() {
    const templates = useSelector((state: RootState) => state.templates);
    const [newTemplateName, setNewTemplateName] = useState<string>('');
    const [showNewTemplateModal, setShowTemplateModal] = useState(false);

    // Shows the modal for creating new template
    function showModal(): void {
        setShowTemplateModal(true);
    }

    // Hides the modal fro creating new template.
    function hideModal(): void {
        setNewTemplateName('');
        setShowTemplateModal(false);
    }

    // Handles the modal done button.
    function handleModalDone(): void {
        if (newTemplateName) {
            newTemplate();
        }
        hideModal();
    }

    // This function creates a new template
    function newTemplate() {
        createNewTemplate({
            channels: {},
            modified: moment().format(MODIFIED_DATE_FORMAT),
            name: newTemplateName,
        });
    }

    // Create links for dynamic navbar
    let navLinks: ReactElement[] = [];
    for (const [id, templateData] of Object.entries(templates)) {
        const data = templateData as ChannelTemplate;
        navLinks.push(
            <DynamicNavLink route={id} key={id} name={data.name}>
                <ChannelTemplateContent template={data} templateId={id} />
            </DynamicNavLink>
        );
    }

    return (
        <Switch>
            <Route path={'/app/channel-templates'}>
                <>
                    <DynamicNavbar title={'Templates'} buttonAction={showModal}>
                        {navLinks as any}
                        <DynamicNavLink
                            route={''}
                            key={'default'}
                            name={'default route'}
                            blockLinkRender={true}
                        >
                            <div className={'message'}>
                                Please select a template
                            </div>
                        </DynamicNavLink>
                    </DynamicNavbar>
                    <Modal show={showNewTemplateModal}>
                        <div className={'content'}>
                            <div className={'inputSection'}>
                                <h2>Template Name:</h2>
                                <input
                                    type={'text'}
                                    name={'templateName'}
                                    id={'templateName'}
                                    onChange={(event) => {
                                        setNewTemplateName(
                                            event.currentTarget.value
                                        );
                                    }}
                                    autoFocus
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
                                onClick={hideModal}
                            />
                        </div>
                    </Modal>
                </>
            </Route>
        </Switch>
    );
}
