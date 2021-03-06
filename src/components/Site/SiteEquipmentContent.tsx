import {
  EquipmentUnit,
  LoggerCollection,
  LoggerObject,
} from "../../store/FirestoreInterfaces";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { SiteEquipmentBackButton } from "./SiteEquipmentBackButton";
import TabView, { TabViewItem } from "../TabView";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Button } from "reactstrap";
import { addLoggerToEquipment } from "../../scripts/FireConfig";

interface SiteEquipmentContentProps {
  // The name of the site that the equipment is a part of
  siteName: string;

  //ID of the site the equipment is a part of
  siteId: string;

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
  siteId,
  unit,
}: SiteEquipmentContentProps): ReactElement {
  const [selectorCollapsed, setSelectorCollapsed]: [Boolean, any] = useState(
    true
  );

  const loggers: LoggerCollection = useSelector(
    (state: RootState) => state.loggers
  );

  var loggerTabs: any = [];

  for (const [id, loggerData] of Object.entries(loggers)) {
    const data = loggerData as LoggerObject;

    //only make logger tabs for loggers attached to the current unit
    if (unit?.loggers.find((loggerId) => loggerId === id)) {
      loggerTabs.push(
        <TabViewItem label={String(id)} route={String(id)}>
          {LoggerTab(data)}
        </TabViewItem>
      );
    }
  }

  function handleAddLoggerClick(e: SyntheticEvent) {
    setSelectorCollapsed(false);
  }

  function handleClickOutsideLoggerSelector(e: SyntheticEvent) {
    const target = e.target as HTMLElement;

    //Only collapse the logger if we click on something other than the Add Logger button or the Logger Selector.
    if (
      !(
        target.className.includes("addLogger") ||
        target.className.includes("loggerSelector") ||
        target.className.includes("loggerCard")
      )
    ) {
      setSelectorCollapsed(true);
    }
  }

  return (
    <div
      className={"site-equipment"}
      onClick={handleClickOutsideLoggerSelector}
    >
      <SiteEquipmentBackButton label={siteName} />
      {unit ? (
        <h1>{unit.name}</h1>
      ) : (
        <div className={"message"}>Add or select a piece of equipment.</div>
      )}
      <Button className="addLogger" onClick={handleAddLoggerClick}>
        Add Logger
      </Button>
      {selectorCollapsed ? null : (
        <LoggerSelector siteId={siteId} unitName={unit?.name || ""} />
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

interface LoggerSelectorProps {
  //ID of the site the equipment is a part of
  siteId: string;

  // The name of the equipment
  unitName: string;
}

function LoggerSelector({ siteId, unitName }: LoggerSelectorProps) {
  const loggers: LoggerCollection = useSelector(
    (state: RootState) => state.loggers
  );

  var loggerCard: any = [];

  for (const [id, loggerData] of Object.entries(loggers)) {
    const data = loggerData as LoggerObject;

    loggerCard.push(
      <div className="loggerCard" onClick={() => handleLoggerCardClick(id)}>
        <h2>Logger Name</h2>
        {id}
      </div>
    );
  }

  function handleLoggerCardClick(logger_id: string) {
    addLoggerToEquipment(siteId, unitName, logger_id);
  }

  return (
    <div className="loggerSelector">
      <h1>Select Logger</h1>

      {loggerCard}
    </div>
  );
}
