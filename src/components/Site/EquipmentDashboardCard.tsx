import React, { ReactElement } from "react";
import { ResponsiveLine } from "@nivo/line";

export interface EquipmentDashboardCardProps{
  channel: string,
  graphData: any[]
}

export default function DashboardCard({ channel, graphData }: EquipmentDashboardCardProps): ReactElement {

  return (
    <div>
      <h1>{channel}</h1>
      <div className="h-1/2">
        <ResponsiveLine
          data={graphData}
          // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'timestamp',
              legendOffset: 36,
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
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointLabelYOffset={-12}
          useMesh={true}
        />
      </div>
    </div>
  );
}