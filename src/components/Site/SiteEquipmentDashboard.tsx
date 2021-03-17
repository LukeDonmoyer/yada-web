/**
 * 
 * 
 * 
 * Get channels from each template -> map channels to loggers that have them -> for each channel -> for each logger -> transform data for channel -> add data to Nivo struct -> render graph
 * 
 * TODO: parse timestamps, render actual cards, create theme, 
 * pass channel type to change yScale type, make tab itself scrollable, 
 * refactor channelsOnUnit to be a map with data type
 */

import { ResponsiveLine } from "@nivo/line";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import dataTransformer from "scripts/DataTransformer";
import { ChannelTemplateCollection, EquipmentUnit, LoggerCollection, LoggerObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";
import EquipmentDashboardCard from "./EquipmentDashboardCard";

export interface EquipmentDashboardProps {
  loggers: LoggerCollection,
  unit?: EquipmentUnit
}

function getLoggersOnUnit(loggers: LoggerCollection, unit?: EquipmentUnit): LoggerObject[]{
  let loggersOnUnit: LoggerObject[] = [];

  for (const [id, logger] of Object.entries(loggers)){
    if (unit?.loggers.find((loggerId) => loggerId === id))
      loggersOnUnit.push(logger);
  }

  return loggersOnUnit;
}

function getChannelsFromLoggers(loggers: LoggerObject[], channelTemplates: ChannelTemplateCollection): string[] {
  let channelsFromLoggers: string[] = [];
  
  for (const logger of loggers){
    for (const key in channelTemplates[logger.channelTemplate].keys){
      if (!channelsFromLoggers.includes(key))
        channelsFromLoggers.push(key);
    }
  }

  return channelsFromLoggers.filter(c => c !== "timestamp").sort();
}

function getChannelDataFromLoggers(channel: string, loggers: LoggerObject[]): any[]{
  let channelData: any[] = [];

  for (const logger of loggers){
    if (logger.data.some((d: any) => d.hasOwnProperty(channel))){
      channelData.push({
        id: logger.name,
        data: dataTransformer(logger.data, channel)
      });
      console.log(channelData);
    }
  }

  return channelData;
}

export default function EquipmentDashboard({
  loggers,
  unit
}: EquipmentDashboardProps): ReactElement {

  let channelTemplates = useSelector((state: RootState) => state.templates);
  let loggersOnUnit: LoggerObject[] = getLoggersOnUnit(loggers, unit);
  let channelsOnUnit: string[] = getChannelsFromLoggers(loggersOnUnit, channelTemplates);
  let dashboardCards: ReactElement[] = [];

  for(const channel of channelsOnUnit){
    dashboardCards.push(
      <EquipmentDashboardCard 
        channel={channel}
        graphData={getChannelDataFromLoggers(channel, loggersOnUnit)}      
      />
    );
  }

  return (
    <div className="equipmentDashboard grid grid-cols-2">
      {dashboardCards}
    </div>
  );
}