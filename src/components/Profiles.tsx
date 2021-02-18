/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/profiles'
 * purpose: page that wiill provide access to manage sites
 */

import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { getUserPrivilege } from "../FireConfig";
import AuthCheck from "./AuthCheck";
import { defaultNavItems } from "./SideNavbar";
import { useState } from "react";
import { ContentWithTopLevelNavbar } from "./Sections";

export default function Profiles() {
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
    <div className="custom">
      <h1>Profiles: </h1>
    </div>
  );
}
