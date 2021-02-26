/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewSite } from "scripts/FireConfig";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";
import { EquipmentUnit, SiteObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";
import DynamicNavbar, { DynamicNavLink } from "../DynamicNavbar";
import SiteEquipment from "./SiteEquipment";
import TabView, { TabViewItem } from "../TabView";

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
  //TODO Make site equipment tab
  return <h1>Equipment</h1>;
}

function FaultsTab(): ReactElement {
  //TODO Make site fault tab
  return <h1>Faults</h1>;
}

function ConfigTab(): ReactElement {
  //TODO: Make site config tab
  return <h1>Config</h1>;
}
