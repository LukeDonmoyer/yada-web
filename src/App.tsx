import React, { useState } from "react";
import "assets/App.scss";
import "assets/tailwind.css";
import {
  fireAuth,
  fireAuthSignOut,
  getUserPrivilege,
  initializeChannelTemplatesListener,
  initializeSitesListener,
  initializeUsersListener,
  resetRedux,
} from "./scripts/FireConfig";

import Onboard from "./components/Onboard";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import ChangePassword from "components/ChangePassword";
import RegisterUsers from "components/RegisterUsers";
import ContactUs from "components/ContactUs";
import RequestAccount from "components/RequestAccount";

import authSlice from "store/FireActions";
import store from "./store/store";
import Sites from "components/Sites";
// import Profiles from "components/Profiles";
// import AdminManagement from "components/AdminManagement";
import UserSettings from "components/UserSettings";
import NotFound from "components/NotFound";
import { RootState } from "store/rootReducer";
import { useSelector } from "react-redux";
import AuthCheck from "components/AuthCheck";
import { Animated } from "react-animated-css";
import StaticNavbar, { StaticNavItem } from "components/StaticNavbar";
import Dashboard from "components/Dashboard";
import ChannelTemplates from "components/ChannelTemplates";
import UserManagement from "components/UserManagement";
import homeIcon from "assets/icons/home.svg";
import sitesIcon from "assets/icons/site.svg";
import templatesIcon from "assets/icons/hvac.svg";
import settingsIcon from "assets/icons/settings.svg";
import usersIcon from "assets/icons/accountManagement.svg";
import updateUsersSlice from "store/UserAction";

function App() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const [userPrivilege, setPrivilege] = useState("User");

  fireAuth.onAuthStateChanged((userAuth) => {
    store.dispatch(authSlice.actions.login(userAuth?.uid));
    if (userAuth != null && userAuth !== undefined) {
      initializeSitesListener();
      initializeUsersListener();
      initializeChannelTemplatesListener();
    } else {
      resetRedux();
    }
  });

  getUserPrivilege().then((privilege) => {
    setPrivilege(privilege);
  });

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Onboard}/>
        <Route path="/app">
          {currentUser === null || currentUser === undefined ? (
            <AuthCheck />
          ) : (
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              isVisible={true}
            >
              <div className="app">
                <StaticNavbar
                  autoCollapse={true}
                  roundRightCorners={true}
                  currentPrivilege={userPrivilege}
                >
                  <StaticNavItem
                    label={"dashboard"}
                    route={"dashboard"}
                    icon={homeIcon}
                  >
                    <Dashboard />
                  </StaticNavItem>
                  <StaticNavItem
                    label={"sites"}
                    route={"sites"}
                    icon={sitesIcon}
                  >
                    <Sites />
                  </StaticNavItem>
                  <StaticNavItem
                    label={"channel templates"}
                    route={"channel-templates"}
                    icon={templatesIcon}
                  >
                    <ChannelTemplates />
                  </StaticNavItem>
                  {["Owner", "Admin"].includes(userPrivilege) ? (
                    <StaticNavItem
                      label="user management"
                      route="usermanagement"
                      icon={usersIcon}
                    >
                      <UserManagement />
                    </StaticNavItem>
                  ) : (
                    <></>
                  )}
                  <StaticNavItem
                    label="settings"
                    route="settings"
                    icon={settingsIcon}
                  >
                    <UserSettings />
                  </StaticNavItem>
                </StaticNavbar>
              </div>
            </Animated>
          )}
        </Route>
        <Route path="/change-password">
          <ChangePassword />
        </Route>
        <Route path="/register-users">
          <RegisterUsers />
        </Route>
        <Route path="/contact-us">
          <ContactUs />
        </Route>
        <Route path="/request-account">
          <RequestAccount />
        </Route>
        <Route path={"*"} component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
