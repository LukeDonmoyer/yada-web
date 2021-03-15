import React, { ReactElement } from 'react';

import { SiteObject } from '../../store/FirestoreInterfaces';
import Statistic from './Statistic';
import { Link } from 'react-router-dom';
import SiteLatestFaultTable from './SiteLatestFaultTable';

interface SiteCardProps {
    // The Site Object to get information from
    site: SiteObject;

    // The id of the site object
    siteId: string;
}

/**
 * Component to display some basic information about a site as a card.
 *
 * @param site The site object to get information from
 * @param siteId The id of the site object
 * @constructor
 */
export default function SiteCard({
    site,
    siteId,
}: SiteCardProps): ReactElement {
    const sum = (x: number, y: number) => x + y;

    return (
        <div className={'card'}>
            <div className={'site-information'}>
                <div>
                    <h3>{site.name}</h3>
                </div>
                <div>
                    <Statistic
                        value={site.equipmentUnits.length}
                        label={'Total units'}
                    />
                    <Statistic
                        value={site.equipmentUnits
                            .map((unit) => unit.loggers.length)
                            .reduce(sum, 0)}
                        label={'Total loggers'}
                    />
                </div>
                <div>
                    <Statistic
                        valueClassName={'fault-statistic'}
                        value={site.equipmentUnits
                            .map((site) => site.faults.length)
                            .reduce(sum, 0)}
                        label={'Total faults'}
                    />
                </div>
            </div>
            <SiteLatestFaultTable site={site} numFaults={3} />
            <div className={'details-button'}>
                <Link to={`/app/sites/${siteId}`}>
                    <div className={'details-link'}>View Details</div>
                </Link>
                <svg width={24} height={24} viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
            </div>
        </div>
    );
}
