/**
 * 
 * 
 * 
 * Get channels from each template -> map channels to loggers that have them -> for each channel -> for each logger -> transform data for channel -> add data to Nivo struct -> render graph
 */

import { ReactElement } from "react";
import { useSelector } from "react-redux";
import dataTransformer from "scripts/DataTransformer";
import { ChannelTemplateCollection, EquipmentUnit, LoggerCollection, LoggerObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";

export interface EquipmentDashboardProps {
  loggers: LoggerCollection,
  unit?: EquipmentUnit
}

export default function EquipmentDashboard({
  loggers,
  unit
}: EquipmentDashboardProps): ReactElement {

  let channelTemplates = useSelector((state: RootState) => state.templates);
  let loggersOnUnit: LoggerObject[] = []

  for (const [id, logger] of Object.entries(loggers)){
    if (unit?.loggers.find((loggerId) => loggerId === id))
      loggersOnUnit.push(logger);
  }

  const loggerNames = () => {
    let loggerNames = [];

    for (const logger of loggersOnUnit){
      for (const key in channelTemplates[logger.channelTemplate].keys){
        loggerNames.push(
          <div>
            <li>{ key }</li>
          </div>
        );
      }
    }

    return loggerNames;
  }

  return (
    <div>
      { loggerNames }
    </div>
  );
}