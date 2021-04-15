import React, { ReactElement } from 'react';

import { SiteObject } from 'store/FirestoreInterfaces';
import Statistic from './Statistic';
import { Link } from 'react-router-dom';
import SiteLatestFaultTable from './SiteLatestFaultTable';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import logger from 'redux-logger';

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

    const loggers = useSelector((state: RootState) => state.loggers);

    function getFaultCount(site: SiteObject) {
        var faultCount = 0;

        //for each equipment in the site
        site.equipmentUnits.forEach((unit) => {
            //for each logger_uid on the equipment
            unit.loggers.forEach((logger_uid) => {
                //make sure the logger_uid is defined and not null
                if(typeof logger_uid !== 'undefined' && logger_uid){
                    faultCount += loggers[logger_uid]?.faults.length;
                }                
            });
        });

        return faultCount;
    }

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
                        value={getFaultCount(site)}
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
