/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/user-management'
 * purpose: page that wiill provide access to manage sites
 */

import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { getUserPrivilege } from "../FireConfig";
import AuthCheck from "./AuthCheck";
import { defaultNavItems } from "./SideNavbar";
import React, { useState } from "react";
import { ContentWithTopLevelNavbar } from "./Sections";
import { Redirect } from "react-router-dom";

export default function UserManagement() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const [authorized, setAuthorization] = useState(false);

  // if there is no logged in user redirect home
  if (currentUser === null || currentUser === undefined) {
    return <AuthCheck />;
  }

  getUserPrivilege().then((privilege) => {
    if (privilege === "Owner" || privilege === "Admin") {
      setAuthorization(true);
    }
  });

  return (
    <div className="">
      {authorized ? (
        <div className="custom">
          <h1>User Management: </h1>
        </div>
      ) : (
        <AuthCheck additionalMessage={"You do not have proper authentication for this page. Please log in as an admin, or contact your admin for access."}/> 
      )}
    </div>
  );
}
