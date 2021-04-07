/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/channel-templates'
 * purpose: page that will provide access to manage channel templates
 */

import React, { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import DynamicNavbar, { DynamicNavLink } from '../Control/DynamicNavbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';
import ChannelTemplateContent from './ChannelTemplateContent';

function createNewTemplate() {}

/**
 * Main container component for channel template pages.
 *
 * @constructor
 */
export default function ChannelTemplates() {
    const templates = useSelector((state: RootState) => state.templates);

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
                <DynamicNavbar
                    title={'Templates'}
                    buttonAction={createNewTemplate}
                >
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
            </Route>
        </Switch>
    );
}
