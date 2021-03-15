/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewEquipment, createNewSite } from '../../scripts/Datastore';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { SiteObject } from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';
import DynamicNavbar, { DynamicNavLink } from '../Control/DynamicNavbar';
import SiteEquipment from './SiteEquipment';
import TabView, { TabViewItem } from '../Control/TabView';
import Button, { ButtonType } from 'components/Control/Button';
import { basename } from 'path';
import ConfigTab from './SiteConfigContent';
import SiteFaultsTab from './SiteFaultsTab';
import SiteEquipmentTab from './SiteEquipmentTab';

export default function Sites() {
    const sites = useSelector((state: RootState) => state.sites);
    let navLinks: any = [];

    for (const [id, siteData] of Object.entries(sites)) {
        const data = siteData as SiteObject;
        navLinks.push(
            <DynamicNavLink route={id} key={id} name={data.name}>
                <SiteContent site={sites[id]} siteId={id} />
            </DynamicNavLink>
        );
    }

    return (
        <Switch>
            <Route path={'/app/sites/:siteId/equipment'}>
                <SiteEquipment />
            </Route>
            <Route path={'/app/sites'}>
                <DynamicNavbar title={'Sites'} buttonAction={createNewSite}>
                    {navLinks}
                    <DynamicNavLink
                        route={''}
                        key={'default'}
                        name={'default route'}
                        blockLinkRender={true}
                    >
                        <div className={'message'}>Please select a site</div>
                    </DynamicNavLink>
                </DynamicNavbar>
            </Route>
        </Switch>
    );
}

export interface SiteContentProps {
    site: SiteObject;
    siteId: string;
}

function SiteContent({ site, siteId }: SiteContentProps): ReactElement {
    return (
        <div className={'sites'}>
            <h1>{site.name}</h1>
            <TabView>
                <TabViewItem label={'Equipment'} default>
                    <SiteEquipmentTab />
                </TabViewItem>
                <TabViewItem label={'Faults'} route={'faults'}>
                    <SiteFaultsTab site={site} />
                </TabViewItem>
                <TabViewItem label={'Config'} route={'config'}>
                    <ConfigTab site={site} siteId={siteId} />
                </TabViewItem>
            </TabView>
        </div>
    );
}
