/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/dashboard'
 * purpose: currently displays the logged in user's UID and provides a button to log out
 */

import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import React, { ReactElement, useState } from 'react';
import SearchBar from './SearchBar';
import SiteCard from './SiteCard';
import {
    Fault,
    SiteCollection,
    SiteObject,
} from '../../store/FirestoreInterfaces';
import moment from 'moment';

/**
 * Main Dashboard container component.
 *
 * @constructor
 */
export default function Dashboard() {
    const sites = useSelector((state: RootState) => state.sites);
    const loggers = useSelector((state: RootState) => state.loggers);
    const [searchQuery, setSearchQuery] = useState('');

    function getMostRecentSiteFaultMoment(site: SiteObject) {
        //initialize to earliest moment (start of unix epoch)
        var mostRecentFaultTime = moment(0);

        site.equipmentUnits.forEach((unit) => {
            unit.loggers.forEach((logger_uid) => {
                if (loggers[logger_uid]) {
                    //Assuming the most recent fault is at the end of the logger faults array.
                    const mostRecentIndex =
                        loggers[logger_uid].faults.length - 1;

                    //check that the logger has at least 1 fault
                    if (mostRecentIndex > -1) {
                        const loggerMostRecentFaultTime = moment(
                            loggers[logger_uid].faults[mostRecentIndex]
                                .timestamp
                        );

                        if (
                            loggerMostRecentFaultTime.isAfter(
                                mostRecentFaultTime
                            )
                        ) {
                            mostRecentFaultTime = loggerMostRecentFaultTime;
                        }
                    }
                }
            });
        });

        return mostRecentFaultTime;
    }

    /**
     * Creates a list of sites card elements from the given collection of sites.
     *
     * @param sites The collection of sites to make cards for.
     */
    function createSiteElements(sites: SiteCollection): ReactElement[] {
        let result: ReactElement[] = [];

        let querySiteKeyPair = [];

        for (let key in sites) {
            if (!sites.hasOwnProperty(key)) continue;
            if (
                !sites[key].name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
                continue;

            //add the site to the list of query results
            querySiteKeyPair.push({ site: sites[key], key: key });
        }

        //sort site array based on each site's most recent fault
        querySiteKeyPair.sort((a, b) => {
            var momentA = getMostRecentSiteFaultMoment(a.site);
            var momentB = getMostRecentSiteFaultMoment(b.site);

            return momentB.diff(momentA);
        });

        //create react elements from the filtered and sorted sites
        querySiteKeyPair.forEach((siteKeyPair) =>
            result.push(
                <SiteCard site={siteKeyPair.site} siteId={siteKeyPair.key} />
            )
        );

        return result;
    }

    return (
        <div className={'dashboard'}>
            <h1>Site Overview</h1>
            <SearchBar hint={'Search'} onInput={setSearchQuery} />
            <div className={'card-container'}>{createSiteElements(sites)}</div>
        </div>
    );
}
