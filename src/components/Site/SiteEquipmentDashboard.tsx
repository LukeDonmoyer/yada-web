import { Logger } from "@material-ui/data-grid";
import { ReactElement } from "react";
import { LoggerCollection } from "store/FirestoreInterfaces";

export interface EquipmentDashboardProps {
  loggers: LoggerCollection
}

export default function EquipmentDashboard({
  loggers
}: EquipmentDashboardProps): ReactElement {

  function loggerNames(loggers: LoggerCollection){
    let loggerNames = [];

    for(const [id, loggerData] of Object.entries(loggers)){
      loggerNames.push(
        <h2>{loggerData.name}</h2>
      );
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