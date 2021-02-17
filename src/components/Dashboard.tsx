/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/dashboard'
 * purpose: currently displays the logged in user's UID and provides a button to log out
 */

import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { getUserPrivilege } from "../FireConfig";
import AuthCheck from "./AuthCheck";
import { defaultNavItems } from "./SideNavbar";
import { useState } from "react";
import { ContentWithTopLevelNavbar } from "./Sections";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const [userPrivilege, setPrivilege] = useState("User");

  getUserPrivilege().then((privilege) => {
    setPrivilege(privilege);
  });

  // if there is no logged in user redirect home
  if (currentUser === null || currentUser === undefined) {
    return <AuthCheck />;
  }

  return (
    <ContentWithTopLevelNavbar
      navItems={defaultNavItems}
      privilege={userPrivilege}
      currentRoute={"/dashboard"}
      children={
        <div className="custom">
          <h1>Dashboard: </h1>
          <p>logged in user: </p>
          <p>{JSON.stringify(currentUser)}</p>
        </div>
      }
    />
  );
}
