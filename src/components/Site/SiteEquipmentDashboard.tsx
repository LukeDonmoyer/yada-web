/**
 * 
 *
 */

import { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import dataTransformer from 'scripts/DataTransformer';
import {
    ChannelTemplateCollection,
    EquipmentUnit,
    LoggerCollection,
    LoggerObject,
} from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';
import EquipmentDashboardCard from './EquipmentDashboardCard';

export interface EquipmentDashboardProps {
    loggers: LoggerCollection;
    unit?: EquipmentUnit;
}

function getLoggersOnUnit(
    loggers: LoggerCollection,
    unit?: EquipmentUnit
): LoggerObject[] {
    let loggersOnUnit: LoggerObject[] = [];

    for (const [id, logger] of Object.entries(loggers)) {
        if (unit?.loggers.find((loggerId) => loggerId === id))
            loggersOnUnit.push(logger);
    }

    return loggersOnUnit;
}

function getChannelsFromLoggers(
    loggers: LoggerObject[],
    channelTemplates: ChannelTemplateCollection
): Map<string, string> {
    let channelsFromLoggers: Map<string, string> = new Map<string, string>();

    for (const logger of loggers) {
        let template = channelTemplates[logger.channelTemplate].keys;

        Object.entries(template).forEach((item) => {
            const [key, value] = item;
            if (!channelsFromLoggers.has(key) && key !== 'timestamp')
                channelsFromLoggers.set(key, value);
        });
    }

    return channelsFromLoggers;
}

function getChannelDataFromLoggers(
    channel: string,
    filter: string,
    loggers: LoggerObject[]
): any[] {
    let channelData: any[] = [];

    for (const logger of loggers) {
        if (logger.data.some((d: any) => d.hasOwnProperty(channel))) {
            channelData.push({
                id: logger.name,
                data: dataTransformer(logger.data, channel, filter),
            });
        }
    }

    return channelData;
}

export default function EquipmentDashboard({
    loggers,
    unit,
}: EquipmentDashboardProps): ReactElement {
    let channelTemplates = useSelector((state: RootState) => state.templates);
    let loggersOnUnit: LoggerObject[] = getLoggersOnUnit(loggers, unit);
    let channelsOnUnit: Map<string, string> = getChannelsFromLoggers(
        loggersOnUnit,
        channelTemplates
    );
    let dashboardCards: ReactElement[] = [];

    let [filterDropdown, setFilterDropdown] = useState(false);
    let [filter, setFilter] = useState("1 month");
    const toggleFilterDropdown = () => setFilterDropdown(!filterDropdown);

    channelsOnUnit.forEach((channelType, channelName) => {
        dashboardCards.push(
            <EquipmentDashboardCard
                channel={channelName}
                channelType={channelType}
                graphData={getChannelDataFromLoggers(
                    channelName,
                    filter,
                    loggersOnUnit
                )}
            />
        );
    });

    return (
        <div className="equipmentDashboard">
            <div className="buttonBar bootStrapStyles">
                <Dropdown isOpen={filterDropdown} toggle={toggleFilterDropdown} className="dropdown">
                    <DropdownToggle caret>
                        Filter
                    </DropdownToggle>
                    <DropdownMenu className="dropdownMenu">
                        <DropdownItem header>Time Interval</DropdownItem>
                        <DropdownItem 
                            onClick={() => setFilter("5 minutes")}
                        >5 minutes</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("15 minutes")}
                        >15 minutes</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("1 hour")}
                        >1 hour</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("6 hours")}
                        >6 hours</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("12 hours")}
                        >12 hours</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("1 day")}
                        >1 day</DropdownItem>
                        <DropdownItem
                            onClick={() => setFilter("1 month")}
                        >1 month</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="cardDiv">
                {dashboardCards}
            </div>
        </div>
    );
}
