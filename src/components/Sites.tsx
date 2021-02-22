/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that wiill provide access to manage sites
 */

import { createNewSite } from "FireConfig";
import React from "react";
import { Redirect } from "react-router-dom";
import Content from "./Content";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";

export default function Sites() {
  let testLinks = [
    <DynamicNavLink route="/app/sites" name="test" />,
    <DynamicNavLink route="/app/error/" name="not active" />,
  ];

  return (
    <Content
      navbar={
        <DynamicNavbar
          title="Sites"
          buttonAction={createNewSite}
          links={testLinks}
        />
      }
      head={
        <div className="sites">
          <h1>Slippery Rock: </h1>
        </div>
      }
      body={<div className="sites"></div>}
    />
  );
}
