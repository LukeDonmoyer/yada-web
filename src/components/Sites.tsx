/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that wiill provide access to manage sites
 */

import { createNewSite, initializeSitesListener } from "FireConfig";
import React from "react";
import { useSelector } from "react-redux";
import {
  Link,
  Redirect,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import { SiteObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";
import Content from "./Content";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";
import SiteEquipment, { SiteEquipmentContent } from "./SiteEquipment";

export default function Sites() {
  const sites = useSelector((state: RootState) => state.updateSites.sites);
  let location = useLocation();

  let navLinks: any = [];

  for (const [id, siteData] of Object.entries(sites)) {
    const data = siteData as SiteObject;
    navLinks.push(
      <DynamicNavLink route={`/app/sites/${id}`} key={id} name={data.name}>
        <>
          <p>{JSON.stringify(data)}</p>
          <Link to={`/app/sites/${id}/equipment`}>Equipment</Link>
        </>
      </DynamicNavLink>
    );
  }

  return (
    <div className="sites">
      <Route path={"/app/sites/:siteId/equipment"}>
        <SiteEquipment />
      </Route>
      <Route path={"/app/sites/"}>
        <DynamicNavbar title={"Sites"} buttonAction={createNewSite}>
          {navLinks}
          <DynamicNavLink
            route={"/app/sites/"}
            key={"default"}
            name={"default route"}
            blockLinkRender={true}
          >
            <p>Please select a site</p>
          </DynamicNavLink>
        </DynamicNavbar>
      </Route>
    </div>
  );
}
