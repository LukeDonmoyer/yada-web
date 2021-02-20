/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that wiill provide access to manage sites
 */

import React from "react";
import Content from "./Content";

export default function Sites() {
  return (
    <Content
      head={
        <div className="sites">
          <h1>Sites: </h1>
        </div>
      }
      body={<div></div>}
    />
  );
}
