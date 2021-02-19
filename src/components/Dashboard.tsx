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
import SideNavbar, { defaultNavItems } from "./SideNavbar";
import React, { useState } from "react";
import { ContentWithTopLevelNavbar } from "./Sections";
import { Animated } from "react-animated-css";
import { Route } from "react-router-dom";
import Sites from "./Sites";
import ChannelTemplates from "./ChannelTemplates";
import UserManagement from "./UserManagement";
import Settings from "./Settings";

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
    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
      <div className="withSideNavbar">
        <SideNavbar
          autoCollapse={true}
          roundRightCorners={true}
          currentPrivilege={userPrivilege}
          items={defaultNavItems}
        />
        <Route exact path="/app/">
          <div className="custom">
            <h1>Dashboard: </h1>
            <p>logged in user: </p>
            <p>{JSON.stringify(currentUser)}</p>
          </div>
        </Route>
        <Route exact path="/app/sites" component={Sites} />
        <Route
          exact
          path="/app/channel-templates"
          component={ChannelTemplates}
        />
        <Route exact path="/app/user-management" component={UserManagement} />
        <Route exact path="/app/settings" component={Settings} />
      </div>
    </Animated>
  );
}
