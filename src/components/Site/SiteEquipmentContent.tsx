import {
    EquipmentUnit,
    LoggerCollection,
    LoggerObject,
} from '../../store/FirestoreInterfaces';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { SiteEquipmentBackButton } from './SiteEquipmentBackButton';
import TabView, { TabViewItem } from '../Control/TabView';
import { LoggerSelector, LoggerTab } from './Logger';
import EquipmentDashboard from './SiteEquipmentDashboard';
import Button, { ButtonType } from '../Control/Button';
import bellIcon from '../../assets/icons/Bell.png';
import { Link } from 'react-router-dom';

interface SiteEquipmentContentProps {
    // The name of the site that the equipment is a part of
    siteName: string;

    //ID of the site the equipment is a part of
    siteId: string;

    // The unit to be displayed. If this is undefined, a message will be shown instead.
    unit?: EquipmentUnit;
}

/**
 * Displays the actual content for a selected piece of equipment.
 *
 * @constructor
 */
export function SiteEquipmentContent({
    siteName,
    siteId,
    unit,
}: SiteEquipmentContentProps): ReactElement {
    const [selectorCollapsed, setSelectorCollapsed]: [Boolean, any] = useState(
        true
    );

    const [newFault, setNewFault] = useState({
        computing: true,
        newFault: false,
    });
    const sites = useSelector((state: RootState) => state.sites);
    const lastViewedFaultsDate = sites[siteId].lastViewedFaults
        ? sites[siteId].lastViewedFaults
        : null;

    const loggers: LoggerCollection = useSelector(
        (state: RootState) => state.loggers
    );

    var loggerTabs: any = [];

    // Dashboard tab
    loggerTabs.push(
        <TabViewItem
            key="Dashboard"
            label="Dashboard"
            route="dashboard"
            default
            exact
        >
            <EquipmentDashboard loggers={loggers} unit={unit} />
        </TabViewItem>
    );

    for (const [id, loggerData] of Object.entries(loggers)) {
        const data = loggerData as LoggerObject;

        //only make logger tabs for loggers attached to the current unit
        if (unit?.loggers.find((loggerId) => loggerId === id)) {
            loggerTabs.push(
                <TabViewItem
                    key={id}
                    label={data.name || '<logger.name>'}
                    route={String(id)}
                >
                    <LoggerTab logger={data} logger_uid={id} />
                </TabViewItem>
            );
            // check if the logger has pushed a fault that has not yet been dismissed

            if (newFault.computing) {
                if (data.faults.length > 0) {
                    if (lastViewedFaultsDate === null) {
                        setNewFault({ computing: false, newFault: true });
                    } else {
                        let latestFault = data.faults.reduce((a, b) => {
                            return a.timestamp > b.timestamp ? a : b;
                        });
                        let mostRecentFault = new Date(
                            latestFault.timestamp
                        ).valueOf();
                        if (
                            mostRecentFault > (lastViewedFaultsDate as number)
                        ) {
                            setNewFault({ computing: false, newFault: true });
                        }
                    }
                }
            }
        }
    }

    function handleAddLoggerClick(e: SyntheticEvent) {
        setSelectorCollapsed(false);
    }

    function handleClickOutsideLoggerSelector(e: SyntheticEvent) {
        //leave in to trace bug relating to e.target.className not existing
        console.log(e);

        const target = e.target;

        //Only collapse the logger if we click on something other than the Add Logger button or the Logger Selector.
        if (
            target instanceof HTMLElement &&
            !(
                target?.className?.includes('addLogger') ||
                target?.className?.includes('loggerSelector') ||
                target?.className?.includes('loggerCard')
            )
        ) {
            setSelectorCollapsed(true);
        }
    }

    return (
        <div
            className={'site-equipment'}
            onClick={handleClickOutsideLoggerSelector}
        >
            <SiteEquipmentBackButton label={siteName} />
            <div className="title-button-flex">
                {unit ? (
                    <h1>{unit.name}</h1>
                ) : (
                    <div className={'message'}>
                        Add or select a piece of equipment.
                    </div>
                )}
                <div className="buttons">
                    {newFault.newFault === true ? (
                        <Link to={`/app/sites/${siteId}/faults`}>
                            <Button
                                type={ButtonType.warning}
                                text="New Fault"
                                icon={bellIcon}
                            />
                        </Link>
                    ) : (
                        <></>
                    )}
                    <Button
                        type={ButtonType.tableControl}
                        onClick={handleAddLoggerClick}
                        text="Add Logger"
                    />
                </div>
            </div>
            {selectorCollapsed ? null : (
                <LoggerSelector siteId={siteId} unitName={unit?.name || ''} />
            )}
            {<TabView>{loggerTabs}</TabView>}
        </div>
    );
}
