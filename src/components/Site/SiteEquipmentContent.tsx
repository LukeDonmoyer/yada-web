import {
  EquipmentUnit,
  LoggerCollection,
  LoggerObject,
} from "../../store/FirestoreInterfaces";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { SiteEquipmentBackButton } from "./SiteEquipmentBackButton";
import TabView, { TabViewItem } from "../TabView";
import { DataGrid, GridColDef } from "@material-ui/data-grid";

interface SiteEquipmentContentProps {
  // The name of the site that the equipment is a part of
  siteName: string;

  // The unit to be displayed. If this is undefined, a message will be shown instead.
  unit?: EquipmentUnit;
}

/**
 * Displays the actual content for a selected piece of equipment.
 *
 * @constructor
 */
export function SiteEquipmentContent({
  siteName,
  unit,
}: SiteEquipmentContentProps): ReactElement {
  const loggers: LoggerCollection = useSelector(
    (state: RootState) => state.loggers
  );

  var loggerTabs: any = [];

  for (const [id, loggerData] of Object.entries(loggers)) {
    const data = loggerData as LoggerObject;

    loggerTabs.push(
      <TabViewItem label={String(id)} route={String(id)}>
        {LoggerTab(data)}
      </TabViewItem>
    );
  }

  return (
    <div className={"site-equipment"}>
      <SiteEquipmentBackButton label={siteName} />
      {unit ? (
        <h1>{unit.name}</h1>
      ) : (
        <div className={"message"}>Add or select a piece of equipment.</div>
      )}
      {<TabView>{loggerTabs}</TabView>}
    </div>
  );
}

function LoggerTab(logger: LoggerObject): ReactElement {
  const columns: GridColDef[] = [
    { field: "timestamp", headerName: "timestamp", flex: 1 },
  ];

  let rows: any[] = [];

  logger.data.forEach((dataPoint, index) => {
    rows.push({
      id: index,
      timestamp: dataPoint.timestamp,
    });
  });

  return (
    <div className="loggerTab">
      <h1>Logger Data</h1>
      <DataGrid className="dataGrid" rows={rows} columns={columns} />
    </div>
  );
}
