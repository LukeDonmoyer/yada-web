/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/dashboard'
 * purpose: currently displays the logged in user's UID and provides a button to log out
 */

import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import React from "react";
import Content from "./Content";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  return (
    <div className={"dashboard"}>
      <h1>Site Overview</h1>
      <div className={"search-bar"}>Hello World</div>
      <div className={"card-container"}>
        <div className={"card"}>
          <h3>Hello</h3>
        </div>
      </div>
    </div>
  );
}
