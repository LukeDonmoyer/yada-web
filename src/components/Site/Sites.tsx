/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewSite } from "scripts/FireConfig";
import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect, Route, useLocation } from "react-router-dom";
import { EquipmentUnit, SiteObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";
import DynamicNavbar, { DynamicNavLink } from "../DynamicNavbar";
import SiteEquipment from "./SiteEquipment";
import TabView, { TabViewItem } from "../TabView";
import {
  DataGrid,
  ColDef,
  ValueGetterParams,
  GridToolbar,
} from "@material-ui/data-grid";
import Button, { ButtonType } from "components/Button";
import { createNewEquipment } from "scripts/FireConfig";

export default function Sites() {
  const sites = useSelector((state: RootState) => state.sites);
  let navLinks: any = [];

  for (const [id, siteData] of Object.entries(sites)) {
    const data = siteData as SiteObject;
    navLinks.push(
      <DynamicNavLink route={id} key={id} name={data.name}>
        <SiteContent site={sites[id]} />
      </DynamicNavLink>
    );
  }

  return (
    <>
      <Route path={"/app/sites/:siteId/equipment"}>
        <SiteEquipment />
      </Route>
      <Route path={"/app/sites"}>
        <DynamicNavbar title={"Sites"} buttonAction={createNewSite}>
          {navLinks}
          <DynamicNavLink
            route={""}
            key={"default"}
            name={"default route"}
            blockLinkRender={true}
          >
            <p>Please select a site</p>
          </DynamicNavLink>
        </DynamicNavbar>
      </Route>
    </>
  );
}

interface SiteContentProps {
  site: SiteObject;
}

function SiteContent({ site }: SiteContentProps): ReactElement {
  return (
    <div className={"sites"}>
      <h1>{site.name}</h1>
      <TabView>
        <TabViewItem label={"Equipment"} exact default>
          <EquipmentTab />
        </TabViewItem>
        <TabViewItem label={"Faults"} route={"faults"}>
          <FaultsTab />
        </TabViewItem>
        <TabViewItem label={"Config"} route={"config"}>
          <ConfigTab />
        </TabViewItem>
      </TabView>
    </div>
  );
}

function EquipmentTab(): ReactElement {
  const [filter, updateFilter] = useState("");
  const location = useLocation();
  const siteID = location.pathname.split("/")[3];
  const sites = useSelector((state: RootState) => state.sites);
  const [redirect, changeRedirect] = useState("");

  function filterSearch(unit: any) {
    return unit.name.includes(filter);
  }

  const columns: ColDef[] = [
    { field: "name", headerName: "name", flex: 1 },
    { field: "health", headerName: "health", flex: 1 },
    { field: "type", headerName: "type", flex: 1 },
  ];

  let rows: any[] = [];

  // creates rows
  sites[siteID]["equipmentUnits"]
    .filter((unit) => filterSearch(unit))
    .forEach((unit) => {
      rows.push({
        name: unit.name,
        health: unit.health,
        type: unit.type,
        id: unit.name,
      });
    });

  function handleRowClick(row: any) {
    // alert(`navigating to ${row.row.name} unit`);
    let equipmentName = row.row.name.replace(" ", "-");
    changeRedirect(`/app/sites/${siteID}/equipment/${equipmentName}`);
  }

  function handleNewEquipmentClick() {
    createNewEquipment(siteID);
  }

  if (redirect != "") {
    return <Redirect to={redirect} />;
  }
  //TODO Make site equipment tab
  return (
    <div className="table">
      <div className="tableControls">
        <input
          className="input"
          type={"text"}
          value={filter}
          placeholder={"filter"}
          onChange={(event) => {
            updateFilter(event.target.value);
          }}
        />
        <Button
          type={ButtonType.tableControl}
          text={"create equipment"}
          onClick={() => {
            handleNewEquipmentClick();
          }}
        />
      </div>
      <div className="dataGrid">
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(row) => handleRowClick(row)}
          // pageSize={5}
          components={{
            Toolbar: GridToolbar,
          }}
          // autoHeight={true}
        />
      </div>
    </div>
  );
}

function FaultsTab(): ReactElement {
  //TODO Make site fault tab
  return <h1>Faults</h1>;
}

function ConfigTab(): ReactElement {
  //TODO: Make site config tab
  return <h1>Config</h1>;
}
