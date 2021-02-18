/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/user-management'
 * purpose: page that wiill provide access to manage users
 */

import { getUserPrivilege } from "../FireConfig";
import AuthCheck from "./AuthCheck";
import React, { useState } from "react";
export default function UserManagement() {
  const [authorized, setAuthorization] = useState(false);

  getUserPrivilege().then((privilege) => {
    if (privilege === "Owner" || privilege === "Admin") {
      setAuthorization(true);
    }
  });

  return (
    <div className="custom w-full">
      {authorized ? (
        <div className="">
          <h1>User Management: </h1>
        </div>
      ) : (
        <AuthCheck additionalMessage={"You do not have proper authentication for this page. Please log in as an admin, or contact your admin for access."}/> 
      )}
    </div>
  );
}
