import React from "react";
import { ResponsiveLine } from "@nivo/line";

export default function DashboardCard(){
  const exampleData = [
    {
      id: "equipment1",
      data: [
        {
          "x": "plane",
          "y": 175
        },
        {
          "x": "helicopter",
          "y": 263
        },
        {
          "x": "boat",
          "y": 139
        },
      ]
    },
    {
      id: "equipment2",
      data: [
        {
          "x": "plane",
          "y": 262
        },
        {
          "x": "helicopter",
          "y": 55
        },
        {
          "x": "boat",
          "y": 89
        },
      ]
    }
  ];

  const responsiveLine = (exampleData: any) => {
    <ResponsiveLine
      data={exampleData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'count',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
    />
  }

  return (
    <div>Hello</div>
  );
}