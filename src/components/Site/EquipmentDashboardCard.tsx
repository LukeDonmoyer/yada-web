/**
 * Equipment dashboard card component.
 * 
 * Returns a card containing a graph for the specified channel or a message to the user
 * indicating that there's no data for that channel over the time period specified by filter.
 * 
 * Author: Brendan Ortmann
 */

import React, { ReactElement } from "react";
import { ResponsiveLine } from "@nivo/line";
import { interpolateHcl, quantize } from "d3-interpolate";

export interface EquipmentDashboardCardProps {
    channel: string;
    channelType: string;
    graphData: any[];
}

// Not sure if this is necessary, requires more discussion
function parseFilterToOneThird(filter: string): string {
  let num: number = Math.ceil(parseInt(filter.charAt(0)) / 3);

  return `${num} ${filter.split(' ')[1]}`;
}

export default function DashboardCard({
    channel,
    channelType,
    graphData,
}: EquipmentDashboardCardProps): ReactElement {

    // Specifies custom theme properties
    const themeProperties: {} = {
        textColor: "#4b4b4b",
        fontSize: 12,
        axis: {
            domain: {
                line: {
                    stroke: "#393e41"
                }
            },
            ticks: {
                line: {
                    stroke: "#2292a4"
                },
            },
            legend: {
                text: {
                    fontSize: 13
                }
            }
        },
        grid: {
            line: {
                stroke: "#c9c9c9"
            }
        }
    }

  // Count number of empty data arrays
  // TODO: Refactor this to not be trash
  let dataEmpty: number = 0;
  graphData.forEach((d: any) => {
    if(d.data.length == 0)
      dataEmpty++;
  });

  // If all data arrays are empty, return a message indicating this to the user
  if (dataEmpty == graphData.length)
    return (
      <div className="card">
        <h2>{channel}</h2>
        <div>
          <p>No data exists for this channel during the time period specified.</p> 
          <p>To change the time scale, click the "Filter" button in the top right corner.</p>
        </div>
      </div>
    );

  // Otherwise, return graph with data
  return (
    <div className="card">
      <h2>{channel}</h2>
      <div className="responsiveLine">
        <ResponsiveLine
          data={graphData}
          theme={themeProperties}
          margin={{ top: 25, right: 60, bottom: 65, left: 60 }}
          xScale={{ type: 'time', format: '%m-%d-%Y-%H:%M:%S', useUTC: false, precision: 'second' }}
          xFormat="time:%m-%d-%Y-%H:%M:%S"
          yScale={{ 
              type: (["boolean", "string"].includes(channelType)) ? 'point' : 'linear', 
              min: 'auto', 
              max: 'auto', 
              reverse: false 
          }}
          axisBottom={{
              format: '%H:%M',
              tickValues: 'every 1 minute',
              orient: 'bottom',
              tickSize: 10,
              tickPadding: 5,
              legend: 'timestamp',
              legendOffset: 40,
              legendPosition: 'middle'
          }}
          axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: channel,
              legendOffset: -40,
              legendPosition: 'middle'
          }}
          pointSize={6}
          pointColor={"#f5f5f5"}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-left',
              direction: 'row',
              translateY: 65,
              itemsSpacing: 38,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
            }
          ]}
        />
      </div>
    </div>
  );
}