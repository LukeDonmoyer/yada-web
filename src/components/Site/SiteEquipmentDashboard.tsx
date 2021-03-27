/**
 *
 *
 *
 * Get channels from each template -> map channels to loggers that have them -> for each channel -> for each logger -> transform data for channel -> add data to Nivo struct -> render graph
 *
 * TODO: parse timestamps, render actual cards, create theme,
 * pass channel type to change yScale type, make tab itself scrollable,
 * refactor channelsOnUnit to be a map with data type
 */

import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
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
        console.log(template);

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
    loggers: LoggerObject[]
): any[] {
    let channelData: any[] = [];

    for (const logger of loggers) {
        if (logger.data.some((d: any) => d.hasOwnProperty(channel))) {
            channelData.push({
                id: logger.name,
                data: dataTransformer(logger.data, channel),
            });
            // console.log(channelData);
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

    channelsOnUnit.forEach((channelType, channelName) => {
        dashboardCards.push(
            <EquipmentDashboardCard
                channel={channelName}
                channelType={channelType}
                graphData={getChannelDataFromLoggers(
                    channelName,
                    loggersOnUnit
                )}
            />
        );
    });

    return <div className="equipmentDashboard">{dashboardCards}</div>;
}
