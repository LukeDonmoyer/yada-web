/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/channel-templates'
 * purpose: page that will provide access to manage channel templates
 */

import React, { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import SiteEquipment from '../Site/SiteEquipment';
import DynamicNavbar, { DynamicNavLink } from '../Control/DynamicNavbar';
import { createNewSite } from '../../scripts/Datastore';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { ChannelTemplate, SiteObject } from '../../store/FirestoreInterfaces';
import { SiteContent } from '../Site/SiteContent';
import ChannelTemplateContent from './ChannelTemplateContent';

function createNewTempalte() {}

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
                <ChannelTemplateContent template={data} />
            </DynamicNavLink>
        );
    }

    return (
        <Switch>
            <Route path={'/app/channel-templates'}>
                <DynamicNavbar
                    title={'Templates'}
                    buttonAction={createNewTempalte}
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
