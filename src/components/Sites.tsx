/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that wiill provide access to manage sites
 */

import React from "react";
import { Redirect } from "react-router-dom";
import Content from "./Content";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";

export default function Sites() {
  function testAction() {
    alert("this function will create a new site");
  }

  let testLinks = [
    <DynamicNavLink route="/app/sites" name="test" />,
    <DynamicNavLink route="/app/error/" name="not active" />,
  ];

  return (
    <Content
      navbar={
        <DynamicNavbar
          title="Sites"
          buttonAction={testAction}
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
