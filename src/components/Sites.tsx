/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that wiill provide access to manage sites
 */

import { initializeSitesListener } from "FireConfig";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import { SiteObject } from "store/FirestoreInterfaces";
import { RootState } from "store/rootReducer";
import Content from "./Content";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";

export default function Sites() {
  const sites = useSelector((state: RootState) => state.updateSites.sites);
  let location = useLocation();

  function getSiteName() {
    return location.pathname.split("/app/sites/")[1];
  }

  function testAction() {
    alert("this function will create a new site");
  }

  let navLinks: any = [];
  let nestedRoutes: any = [];

  for (const [id, siteData] of Object.entries(sites)) {
    const data = siteData as SiteObject;
    navLinks.push(
      <DynamicNavLink route={`/app/sites/${id}`} key={id} name={data.name} />
    );
    nestedRoutes.push(
      <Route key={id} path={`/app/sites/${id}`}>
        <p>{JSON.stringify(data)}</p>
      </Route>
    );
  }

  return (
    <Content
      navbar={
        <DynamicNavbar
          title="Sites"
          buttonAction={testAction}
          links={navLinks}
        />
      }
      head={
        <div className="sites">
          <h1>{getSiteName()}</h1>
        </div>
      }
      body={<div className="sites">{nestedRoutes}</div>}
    />
  );
}
