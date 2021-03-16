/**
 * 
 * 
 * 
 * Get channels from each template -> map channels to loggers that have them -> for each channel -> for each logger -> transform data for channel -> add data to Nivo struct -> render graph
 */

import { Logger } from "@material-ui/data-grid";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import dataTransformer from "scripts/DataTransformer";
import { ChannelTemplateCollection, EquipmentUnit, LoggerCollection, LoggerObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";

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

  return channelsFromLoggers;
}

export default function EquipmentDashboard({
  loggers,
  unit
}: EquipmentDashboardProps): ReactElement {

  let channelTemplates = useSelector((state: RootState) => state.templates);
  let loggersOnUnit: LoggerObject[] = getLoggersOnUnit(loggers, unit);
  let channelsFromLoggers: string[] = getChannelsFromLoggers(loggersOnUnit, channelTemplates);

  return (
    <div>
      { channelsFromLoggers.join() }
    </div>
  );
}