/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewSite } from 'scripts/Datastore';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SiteObject } from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';
import DynamicNavbar, { DynamicNavLink } from 'components/Control/DynamicNavbar';
import SiteEquipment from 'components/Site/SiteEquipment';
import { SiteContent } from 'components/Site/SiteContent';
import Modal from 'components/Control/Modal';
import Button, { ButtonType } from 'components/Control/Button';

/**
 * Container for Sites components.
 *
 * @constructor
 */
export default function Sites() {
    const sites = useSelector((state: RootState) => state.sites);
    const [newSiteName, setNewSiteName] = useState<string>('');
    const [showSiteModal, setShowSiteModal] = useState(false);

    // Shows the modal for creating new template
    function showModal(): void {
        setShowSiteModal(true);
    }

    // Hides the modal fro creating new template.
    function hideModal(): void {
        setNewSiteName('');
        setShowSiteModal(false);
    }

    // Handles the modal done button.
    function handleModalDone(): void {
        if (newSiteName) {
            newSite();
        }
        hideModal();
    }

    // This function creates a new template
    function newSite() {
        createNewSite(newSiteName);
    }

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
                <DynamicNavbar title={'Sites'} buttonAction={showModal}>
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

                <Modal show={showSiteModal}>
                    <div className={'content'}>
                        <div className={'inputSection'}>
                            <h2>Site Name:</h2>
                            <input
                                type={'text'}
                                name={'siteName'}
                                id={'siteName'}
                                onChange={(event) => {
                                    setNewSiteName(
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
            </Route>
        </Switch>
    );
}
