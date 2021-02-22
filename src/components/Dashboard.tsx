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
    <Content
      head={
        <div className="dashboard">
          <h1>Dashboard: </h1>
        </div>
      }
      body={
        <div className="dashboard">
          <p>logged in user: </p>
          <p>{JSON.stringify(currentUser)}</p>
        </div>
      }
    />
  );
}
