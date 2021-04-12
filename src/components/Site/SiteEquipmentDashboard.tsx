/**
 * Equipment dashboard component.
 *
 * Displays cards which contain graphs for each channel measured by the loggers. Provides a filtering dropdown
 * and a download button to download the filtered data as a CSV file.
 *
 * @author Brendan Ortmann
 *
 * @todo Remove points if timescale is large enough, refactor filter to use useRef, refactor dropdown to not be garbo
 */

import Button, { ButtonType } from 'components/Control/Button';
import CsvDownloadButton from 'components/Control/CsvDownloadButton';
import { ReactElement, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import dataToNivoFormat, {
    aggregateDataFromLoggers,
    parseFilterString,
} from 'scripts/DataTransformer';
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

/**
 * Gets all Logger objects associated with loggers on the given unit.
 * @param loggers LoggerCollection on given unit
 * @param unit current unit
 * @returns array of LoggerObjects on given unit
 */
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

/**
 * Creates master list of channels which appear on any logger in @param loggers.
 * @param loggers array of LoggerObjects
 * @param channelTemplates collection of ChannelTemplates which define the
 *        channels that appear on any of the loggers
 * @returns Map containing the name (key) and type (value) of each channel
 */
function getChannelsFromLoggers(
    loggers: LoggerObject[],
    channelTemplates: ChannelTemplateCollection
): Map<string, string> {
    let channelsFromLoggers: Map<string, string> = new Map<string, string>();

    for (const logger of loggers) {

        if (logger.channelTemplate === ""){
            continue;
        }

        let template = channelTemplates[logger.channelTemplate];
        Object.entries(template.channels).forEach((channel) => {
            const [_, channelValue] = channel;
            Object.entries(channelValue.keys).forEach((key) => {
                const [typeKey, typeValue] = key;

                if (
                    !channelsFromLoggers.has(typeKey) &&
                    typeKey !== 'timestamp'
                )
                    channelsFromLoggers.set(typeKey, typeValue);
            });
        });
    }

    console.log(channelsFromLoggers);
    return channelsFromLoggers;
}

/**
 * Gets data from @param channel on @param logger, filtered by @param filter.
 * @param channel string specifying the channel from to pull data
 * @param filter string indicating how old the data can be
 * @param loggers array of LoggerObjects from which to pull data
 * @returns array of objects containing logger name and associated data
 */
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
                data: dataToNivoFormat(logger.data, channel, filter),
            });
        }
    }
    return channelData;
}

export default function EquipmentDashboard({
    loggers,
    unit,
}: EquipmentDashboardProps): ReactElement {
    // Loggers and channel templates
    let channelTemplates = useSelector((state: RootState) => state.templates);
    let loggersOnUnit: LoggerObject[] = getLoggersOnUnit(loggers, unit);
    let channelsOnUnit: Map<string, string> = new Map(
        [
            ...getChannelsFromLoggers(loggersOnUnit, channelTemplates),
        ].sort((a, b) => String(a[0]).localeCompare(b[0]))
    );
    let dashboardCards: ReactElement[] = [];

    // Filter
    let [filterDropdown, setFilterDropdown] = useState(false);
    let [filter, setFilter] = useState('12 hours');
    const toggleFilterDropdown = () => setFilterDropdown(!filterDropdown);

    // Generates the dashboard cards
    channelsOnUnit.forEach((channelType: string, channelName: string) => {
        if (!(channelName === 'timestamp'))
            // Prevent timestamp graph
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

    // Generates proper CSV headers
    let csvHeaders: string[] = Array.from(channelsOnUnit.keys());
    csvHeaders = csvHeaders
        .filter((element: string) => element !== 'timestamp')
        .sort();
    csvHeaders.splice(0, 0, 'logger', 'timestamp');

    return (
        <div className="equipmentDashboard">
            <div className="buttonBar bootStrapStyles">
                <Dropdown
                    isOpen={filterDropdown}
                    toggle={toggleFilterDropdown}
                    className="dropdown"
                >
                    <DropdownToggle caret>Filter</DropdownToggle>
                    <DropdownMenu
                        className="dropdownMenu"
                        right
                        modifiers={{
                            setMaxHeight: {
                                enabled: true,
                                order: 890,
                                fn: (data) => {
                                    return {
                                        ...data,
                                        styles: {
                                            ...data.styles,
                                            overflow: 'auto',
                                            maxHeight: '400px',
                                        },
                                    };
                                },
                            },
                        }}
                    >
                        <DropdownItem header>Time Interval</DropdownItem>
                        <DropdownItem onClick={() => setFilter('5 minutes')}>
                            5 minutes
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('15 minutes')}>
                            15 minutes
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('1 hour')}>
                            1 hour
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('6 hours')}>
                            6 hours
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('12 hours')}>
                            12 hours
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('1 day')}>
                            1 day
                        </DropdownItem>
                        <DropdownItem onClick={() => setFilter('1 month')}>
                            1 month
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => setFilter('1 month')}>
                            Clear filter
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <CsvDownloadButton
                    headers={csvHeaders}
                    filename={
                        `${
                            unit?.name ?? ''
                        }_${new Date()
                            .toLocaleDateString()
                            .replace(/\//g, '-')}.csv`
                    }
                    createData={() =>
                        aggregateDataFromLoggers(
                            loggersOnUnit,
                            parseFilterString(filter)
                        )
                    }
                />
            </div>
            <div className="cardDiv">{dashboardCards}</div>
        </div>
    );
}
