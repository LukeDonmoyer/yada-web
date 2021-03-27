/**
 * Collection of functions to transform Logger data into format required by Nivo.
 *
 * Author: Brendan Ortmann
 */

import _ from 'lodash';

/**
 * Transforms a single data point into the format required by Nivo
 * @param data is an object containing channel names mapped to values
 * @param channelName is the part of the object we're filtering by
 * @returns an object containing the filtered data in the format expected by Nivo
 */
function transformDataPoint(
    data: {
        [key: string]: any;
    },
    channelName: string
): {} {
    if (data.hasOwnProperty(channelName)) {
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
 * @param data is the array of data objects
 * @param channelName is the channel we're filtering by
 * @returns an array of data objects in the format required by Nivo filtered by @param channelName
 */
export default function dataTransformer(
    data: any[],
    channelName: string
): any[] {
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(d, channelName);

        if (!_.isEmpty(dataPoint)) transformedData.push(dataPoint);
    });

    return transformedData;
}
