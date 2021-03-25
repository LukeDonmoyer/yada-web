/**
 * Collection of functions to transform Logger data into format required by Nivo.
 * 
 * Author: Brendan Ortmann
 */

import { timeParse } from "d3-time-format";
import _ from "lodash";

/**
 * Creates a new Date object based on specified filter
 * 
 * TODO: Refactor this to not be trash
 * 
 * @param filter is the string containing what we want to filter by
 * @returns a Date object set based on @param filter
 */
export function parseFilterString(filter: string): Date { 
    let timeVal: Date = new Date();

    switch (filter) {
        case "5 minutes":
            timeVal.setMinutes(timeVal.getMinutes() - 5);
            break;
        case "15 minutes":
            timeVal.setMinutes(timeVal.getMinutes() - 15);
            break;
        case "1 hour":
            timeVal.setHours(timeVal.getHours() - 1);
            break;
        case "6 hours":
            timeVal.setHours(timeVal.getHours() - 6);
            break;
        case "12 hours":
            timeVal.setHours(timeVal.getHours() - 12);
            break;
        case "1 day":
            timeVal.setDate(timeVal.getDate() - 1);
            break;
        case "1 month":
            timeVal.setMonth(timeVal.getMonth() - 1);
            break;
        default:
            break;
    }

    return timeVal;
}

export function filterByDate(
    timestamp: string,
    filter: Date
): boolean {
    let timeParser = timeParse("%m-%d-%Y-%H:%M:%S");
    let parsedTime = timeParser(timestamp)?.getTime() ?? new Date().getTime();

    return parsedTime > filter.getTime();
}

/**
 * Transforms a single data point into the format required by Nivo
 * @param data is an object containing channel names mapped to values
 * @param channelName is the channel we're filtering by
 * @param filter is the date we're filtering by
 * @returns an object containing the filtered data in the format expected by Nivo
 */
function transformDataPoint(
    data: {
        [key: string]: any
    },
    channelName: string,
    filter: Date
): {} {

    if (
        data.hasOwnProperty(channelName) &&
        filterByDate(data["timestamp"], filter)
    ){
        return ({
            x: data["timestamp"],
            y: String(data[channelName])
        });
    } else {
        return {}
    }

}

/**
 * Transforms an array of data objects into the format required by Nivo, filtered by a particular channel
 * @param data is the array of data objects
 * @param channelName is the channel we're filtering by
 * @returns an array of data objects in the format required by Nivo filtered by @param channelName
 */
export default function dataTransformer(data: any[], channelName: string, filter: string): any[]{
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(d, channelName, parseFilterString(filter));

        if (!_.isEmpty(dataPoint))
            transformedData.push(dataPoint);
    });

    return transformedData;
}