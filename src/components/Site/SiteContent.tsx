import { SiteObject } from 'store/FirestoreInterfaces';
import React, { ReactElement } from 'react';
import TabView, { TabViewItem } from 'components/Control/TabView';
import SiteEquipmentTab from './SiteEquipmentTab';
import SiteFaultsTab from './SiteFaultsTab';
import ConfigTab from './SiteConfigContent';

export interface SiteContentProps {
    // The currently displaying site
    site: SiteObject;

    // Id of the currently displaying site
    siteId: string;
}

/**
 * Main content component for a site.
 *
 * @param site The currently displaying site
 * @param siteId ID of the currently displaying site
 * @constructor
 */
export function SiteContent({ site, siteId }: SiteContentProps): ReactElement {
    return (
        <div className={'sites'}>
            <h1>{site.name}</h1>
            <TabView>
                <TabViewItem label={'Equipment'} default>
                    <SiteEquipmentTab />
                </TabViewItem>
                <TabViewItem label={'Faults'} route={'faults'}>
                    <SiteFaultsTab site={site} siteId={siteId} />
                </TabViewItem>
                <TabViewItem label={'Config'} route={'config'}>
                    <ConfigTab site={site} siteId={siteId} />
                </TabViewItem>
            </TabView>
        </div>
    );
}
