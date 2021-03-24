/**
 * Collection of functions to transform Logger data into format required by Nivo.
 * 
 * Author: Brendan Ortmann
 */

import { timeParse } from "d3-time-format";
import _ from "lodash";

/**
 * Transforms a single data point into the format required by Nivo
 * @param data is an object containing channel names mapped to values
 * @param channelName is the part of the object we're filtering by
 * @returns an object containing the filtered data in the format expected by Nivo
 */
function transformDataPoint(
    data: {
        [key: string]: any
    },
    channelName: string
): {} {

    if (data.hasOwnProperty(channelName)){
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
export default function dataTransformer(data: any[], channelName: string): any[]{
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(d, channelName);

        if (!_.isEmpty(dataPoint))
            transformedData.push(dataPoint);
    });

    return transformedData;
}

export function filterData(data: any[], filter: Date, now: Date): any[]{

    // Should this string be passed in?
    let parseTime = timeParse("%m-%d-%Y-%H:%M:%S");

    return data.filter(obj => {
        let newData = obj.data.filter((d: any) => {
            let time = parseTime(d.x)?.getTime() ?? new Date().getTime();
            console.log(time);
            return (filter.getTime() < time && time < now.getTime());
        });
        return newData;
    });
}