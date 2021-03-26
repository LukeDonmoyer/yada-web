import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import DynamicNavbar, { DynamicNavLink } from '../Control/DynamicNavbar';
import { useParams } from 'react-router-dom';
import { EquipmentUnit, SiteObject } from '../../store/FirestoreInterfaces';
import { SiteEquipmentContent } from './SiteEquipmentContent';
import { createNewEquipment } from 'scripts/Datastore';

/**
 * React element to display the equipment for a site in a dynamic sidebar. The current site id is obtained through
 * the url.
 *
 * @constructor
 */
export default function SiteEquipment(): ReactElement {
    const { siteId }: any = useParams();
    const site: SiteObject = useSelector(
        (state: RootState) => state.sites[siteId]
    );

    /**
     * Event handler for adding a new equipment unit.
     */
    function addEquipment(siteId: string) {
        let baseName = 'New Equipment ';
        let nameNum = 0;

        while (
            site['equipmentUnits'].find(
                (element) => element.name === baseName + String(nameNum)
            ) !== undefined
        ) {
            nameNum++;
        }

        createNewEquipment(siteId, baseName + String(nameNum));
    }
    /**
     * Creates a dynamic navbar link for the given equipment unit.
     *
     * @param unit The EquipmentUnit to create a link for.
     */
    function createEquipmentLink(unit: EquipmentUnit): ReactElement {
        return (
            <DynamicNavLink
                route={unit.name.replace(' ', '-')}
                key={unit.name}
                name={unit.name}
            >
                <SiteEquipmentContent
                    siteName={site.name}
                    siteId={siteId}
                    unit={unit}
                />
            </DynamicNavLink>
        );
    }

    if (!site) return <></>;

    return (
        <DynamicNavbar
            title={'Equipment'}
            buttonAction={() => addEquipment(siteId)}
        >
            <DynamicNavLink
                route={''}
                key={'default'}
                name={'default route'}
                blockLinkRender={true}
            >
                <SiteEquipmentContent siteName={site.name} siteId={siteId} />
            </DynamicNavLink>
            {site.equipmentUnits.map(createEquipmentLink) as any}
        </DynamicNavbar>
    );
}
