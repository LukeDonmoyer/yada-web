import React, { ReactElement } from 'react';
import { ResponsiveLine } from '@nivo/line';

export interface EquipmentDashboardCardProps {
    channel: string;
    channelType: string;
    graphData: any[];
}

export default function DashboardCard({
    channel,
    channelType,
    graphData,
}: EquipmentDashboardCardProps): ReactElement {
    return (
        <div className="card">
            <h2>{channel}</h2>
            <div className="responsiveLine">
                <ResponsiveLine
                    data={graphData}
                    margin={{ top: 25, right: 60, bottom: 65, left: 60 }}
                    xScale={{
                        type: 'time',
                        format: '%m-%d-%Y-%H:%M:%S',
                        useUTC: false,
                        precision: 'second',
                    }}
                    xFormat="time:%m-%d-%Y-%H:%M:%S"
                    yScale={{
                        type: ['boolean', 'string'].includes(channelType)
                            ? 'point'
                            : 'linear',
                        min: 'auto',
                        max: 'auto',
                        reverse: false,
                    }}
                    axisBottom={{
                        format: '%H:%M',
                        tickValues: 'every 5 minutes',
                        orient: 'bottom',
                        tickSize: 10,
                        tickPadding: 5,
                        legend: 'timestamp',
                        legendOffset: 34,
                        legendPosition: 'middle',
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: channel,
                        legendOffset: -40,
                        legendPosition: 'middle',
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-left',
                            direction: 'row',
                            translateY: 65,
                            itemsSpacing: 25,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        },
                    ]}
                />
            </div>
        </div>
    );
}
