/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/settings'
 * purpose: page that will provide access to manage user settings
 */

import React from "react";
import Content from "./Content";

export default function Settings() {
  return (
    <Content
      head={
        <div className="settings">
          <h1>Settings: </h1>
        </div>
      }
      body={<div></div>}
    />
  );
}
