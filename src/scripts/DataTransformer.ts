/**
 * Collection of functions to transform Logger data into format required by Nivo.
 */

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
            y: data[channelName]
        });
    } else {
        return {}
    }
}

export default function DataTransformer(data: any[], channelName: string): any[]{
    let transformedData: any[] = [];

    data.forEach((d: any) => {
        let dataPoint = transformDataPoint(d, channelName);

        if (!_.isEmpty(dataPoint))
            transformedData.push(dataPoint);
    });

    return [];
}