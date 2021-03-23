/**
 * Collection of functions to transform Logger data into format required by Nivo.
 */

import { timeParse } from "d3-time-format";
import _ from "lodash";

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