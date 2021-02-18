import React from "react";
import "./App.scss";
import "./tailwind.css";
import { fireAuth, fireAuthSignOut } from "./FireConfig";

import Onboard from "./components/Onboard";
import Dashboard from "./components/Dashboard";

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
import Profiles from "components/Profiles";
import Settings from "components/Settings";

function App() {
  const history = useHistory();

  fireAuth.onAuthStateChanged((userAuth) => {
    console.log("FIREBASE STATE CHANGE");
    store.dispatch(authSlice.actions.login(userAuth?.uid));
  });

  function Logout() {
    fireAuthSignOut().then((result) => {
      history.push("/");
    });

    return <div>logging out</div>;
  }

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      {/* {!(currentUser === null || currentUser === undefined)? {} : {}} */}
      <Switch>
        <Route exact path="/" component={Onboard}>
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/change-password">
          <ChangePassword />
        </Route>
        <Route path="/register-users">
          <RegisterUsers />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/sites">
          <Sites />
        </Route>
        <Route path="/profiles">
          <Profiles />
        </Route>
        {/* <Route path="/user-management">
          <AdminManagement />
        </Route> */}
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/contact-us">
          <ContactUs />
        </Route>
        <Route path="/request-account">
          <RequestAccount />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
