/**
 * Collection of functions to transform Logger data into format required by Nivo.
 *
 * Author: Brendan Ortmann
 */

import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import { timeParse } from 'd3-time-format';
import _ from 'lodash';
import moment from 'moment';
import { LoggerObject } from 'store/FirestoreInterfaces';

/** Class representing a filter. */
export class Filter {
    amount: number;
    unit: moment.unitOfTime.Diff;
    tickValues: string;
    format: string;

    /**
     * Creates a new Filter
     * @param {number} amount - the number of units before now
     * @param {moment.unitOfTime.Diff} unit - the unit of time
     * @param {string} tickValues - specifies how many ticks to show on the Nivo graph
     * @param {string} format - the format of the tick values on the Nivo graph
     */
    constructor(amount: number, unit: moment.unitOfTime.Diff, tickValues: string, format: string) {
        this.amount = amount;
        this.unit = unit;
        this.tickValues = tickValues;
        this.format = format;
    }

    static MINUTES_5 = new Filter(5, "minutes", "every 1 minute", '%H:%M');
    static MINUTES_15 = new Filter(15, "minutes", "every 3 minutes", '%H:%M');
    static HOURS_1 = new Filter(1, "hour", "every 10 minutes", '%H:%M');
    static HOURS_6 = new Filter(6, "hours", "every 1 hours", '%H:%M');
    static HOURS_12 = new Filter(12, "hours", "every 2 hours", '%H:%M');
    static DAYS_1 = new Filter(1, "days", "every 4 hours", '%H:%M');
    static MONTHS_1 = new Filter(1, "month", "every 1 week", '%m/%d');
    static MONTHS_12 = new Filter(12, "months", "every 1 month", '%Y/%m');

    /**
     * Get the difference between then (defined by amount and unit) and now.
     * @returns {Date} The date object specifying how far back from now to filter.
     */
    getTimeDiff(): Date {
        return moment().subtract(this.amount, this.unit).toDate();
    }
    
    /**
     * Get the "name" of this filter.
     * @returns {string} The amount of units.
     */
    getName(): string {
        return `${this.amount} ${this.unit}`
    }
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
    filter: Filter
): any[] {
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(
            d,
            channelName,
            filter.getTimeDiff()
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
    filter: Date
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
