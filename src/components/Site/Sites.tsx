/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewSite } from 'scripts/Datastore';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SiteObject } from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';
import DynamicNavbar, { DynamicNavLink } from 'components/Control/DynamicNavbar';
import SiteEquipment from './SiteEquipment';
import { SiteContent } from './SiteContent';

/**
 * Container for Sites components.
 *
 * @constructor
 */
export default function Sites() {
    const sites = useSelector((state: RootState) => state.sites);

    // Create links for dynamic navbar
    let navLinks: ReactElement[] = [];
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
                    {navLinks as any}
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
