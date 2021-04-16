/**
 * Equipment dashboard component.
 *
 * Displays cards which contain graphs for each channel measured by the loggers. Provides a filtering dropdown
 * and a download button to download the filtered data as a CSV file.
 *
 * @author Brendan Ortmann
 */

import CsvDownloadButton from 'components/Control/CsvDownloadButton';
import { ReactElement, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import dataToNivoFormat, {
    aggregateDataFromLoggers, Filter,
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
    filter: Filter,
    loggers: LoggerObject[]
): any[] {
    let channelData: any[] = [];

    for (const logger of loggers) {
        if (logger.data.some((d: any) => d.hasOwnProperty(channel))) {
            let data: any[] = dataToNivoFormat(logger.data, channel, filter);
            
            if (data.length !== 0)
                channelData.push({
                    id: logger.name,
                    data: data,
                });
        }
    }

    return channelData;
}

export default function EquipmentDashboard({
    loggers,
    unit,
}: EquipmentDashboardProps): ReactElement {
    // Logger and channel template variables
    let channelTemplates = useSelector((state: RootState) => state.templates);
    let loggersOnUnit: LoggerObject[] = getLoggersOnUnit(loggers, unit);
    let channelsOnUnit: Map<string, string> = new Map(
        [ // Sorts channels alphabetically
            ...getChannelsFromLoggers(loggersOnUnit, channelTemplates),
        ].sort((a, b) => String(a[0]).localeCompare(b[0]))
    );
    let dashboardCards: ReactElement[] = [];

    // Filter variables
    let [filterDropdown, setFilterDropdown] = useState(false);
    let [filter, setFilter] = useState(Filter.HOURS_12);
    const toggleFilterDropdown = () => setFilterDropdown(!filterDropdown);

    // Generates the dashboard cards
    channelsOnUnit.forEach((channelType: string, channelName: string) => {
        // Prevent timestamp graph
        if (!(channelName === 'timestamp'))
            dashboardCards.push(
                <EquipmentDashboardCard
                    channel={channelName}
                    channelType={channelType}
                    filter={filter}
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

    // Function to generate dropdown items dynamically
    const dropdownItem = (filter: Filter) => {
        return (
            <DropdownItem onClick={() => setFilter(filter)}>
                {filter.getName()}
            </DropdownItem>
        );
    }

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
                            {Object.values(Filter).map(dropdownItem)}
                        <DropdownItem divider />
                        <DropdownItem onClick={() => setFilter(Filter.HOURS_12)}>
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
                            filter.getTimeDiff()
                        )
                    }
                />
            </div>
            <div className="cardDiv">{dashboardCards}</div>
        </div>
    );
}
