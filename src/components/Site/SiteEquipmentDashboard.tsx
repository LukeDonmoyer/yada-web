import { Logger } from "@material-ui/data-grid";
import { ReactElement } from "react";
import { EquipmentUnit, LoggerCollection } from "store/FirestoreInterfaces";

export interface EquipmentDashboardProps {
  loggers: LoggerCollection,
  unit?: EquipmentUnit
}

export default function EquipmentDashboard({
  loggers,
  unit
}: EquipmentDashboardProps): ReactElement {

  function loggerNames(loggers: LoggerCollection){
    let loggerNames = [];

    for(const [id, loggerData] of Object.entries(loggers)){
      if (unit?.loggers.find((loggerId) => loggerId === id)) {
        loggerNames.push(
          <div>
            <h2>{loggerData.name}</h2>
            <div>{loggerData.data[0]['timestamp']}</div>
          </div>
        );
      }
    }

    return loggerNames;
  }

  return (
    <div>
      {
        loggerNames(loggers)
      }
    </div>
  );
}