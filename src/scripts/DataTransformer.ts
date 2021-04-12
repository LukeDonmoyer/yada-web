/**
 * Collection of functions to transform Logger data into format required by Nivo.
 *
 * Author: Brendan Ortmann
 */

import { timeParse } from 'd3-time-format';
import _ from 'lodash';
import { LoggerObject } from 'store/FirestoreInterfaces';

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
        case '5 minutes':
            timeVal.setMinutes(timeVal.getMinutes() - 5);
            break;
        case '15 minutes':
            timeVal.setMinutes(timeVal.getMinutes() - 15);
            break;
        case '1 hour':
            timeVal.setHours(timeVal.getHours() - 1);
            break;
        case '6 hours':
            timeVal.setHours(timeVal.getHours() - 6);
            break;
        case '12 hours':
            timeVal.setHours(timeVal.getHours() - 12);
            break;
        case '1 day':
            timeVal.setDate(timeVal.getDate() - 1);
            break;
        case '1 month':
            timeVal.setMonth(timeVal.getMonth() - 1);
            break;
        default:
            break;
    }

    return timeVal;
}

/**
 * Checks if @param timestamp is greater than time given by @param filter.
 * @param {string} timestamp string containing date and time in format specified 
 *        by DB
 * @param {Date} filter Date object specifying the time we're checking against
 * @returns {boolean} result of comparison
 */
export function filterByDate(timestamp: string, filter: Date): boolean {
    return timestampToDate(timestamp).getTime() > filter.getTime();
}

/**
 * Converts @param timestamp (in format specified by logger data as in DB) to
 * a @type {Date} object.
 * @param {string} timestamp string containing date and time in format specified
 *        by DB
 * @returns {Date} Date object from parsed timestamp or a new Date object if the
 *          parsed result is null
 */
export function timestampToDate(timestamp: string): Date {
    let timeParser = timeParse('%m-%d-%Y-%H:%M:%S'); // Should probably make this string a global constant somewhere
    return timeParser(timestamp) ?? new Date();
}

/**
 * Transforms a single data point into the format required by Nivo
 * @param {object} data object containing channel names mapped to values
 * @param {string} channelName the channel we're filtering by
 * @param {Date} filter the date we're filtering by
 * @returns {object} object containing the filtered data in the format expected by Nivo
 */
function transformDataPoint(
    data: {
        [key: string]: any;
    },
    channelName: string,
    filter: Date
): {} {
    if (
        data.hasOwnProperty(channelName) &&
        filterByDate(data['timestamp'], filter)
    ) {
        return {
            x: data['timestamp'],
            y: String(data[channelName]),
        };
    } else {
        return {};
    }
}

/**
 * Transforms an array of data objects into the format required by Nivo, filtered by a particular channel
 * @param {any[]} data array of data objects
 * @param {string} channelName the channel we're filtering by
 * @returns {any[]} array of data objects in the format required by Nivo filtered by channelName
 */
export default function dataToNivoFormat(
    data: any[],
    channelName: string,
    filter: string
): any[] {
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(
            d,
            channelName,
            parseFilterString(filter)
        );

        if (!_.isEmpty(dataPoint)) transformedData.push(dataPoint);
    });

    return transformedData;
}

/**
 * Gets all data associated with loggers in @param loggers, applies the
 * filter specified by @param filter, and returns an array containing
 * the data.
 * @param {LoggerObject[]} loggers array of Logger objects from which to pull data
 * @param {Date} filter (optional) Date object specifying the time period of data to
 *        pull from
 * @returns {any[]} array of objects containing the data and the logger each piece
 *          of data was pulled from
 */
export function aggregateDataFromLoggers(
    loggers: LoggerObject[],
    filter: Date = new Date(0)
): any[] {
    let data: any[] = [];

    loggers.forEach((logger: LoggerObject) => {
        //add data points from logger and tag with logger uid
        logger.data.forEach((dataPoint: any, index: number) => {
            let dataEntry = Object.assign({}, dataPoint);
            dataEntry['logger'] = logger.name;

            if (filterByDate(dataEntry['timestamp'], filter))
                data.push(dataEntry);
        });
    });

    return data;
}
