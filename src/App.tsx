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
      <Switch>
        <Route exact path="/" component={Onboard}>
          {/* <Onboard /> */}
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/changePassword">
          <ChangePassword />
        </Route>
        <Route path="/registerUsers">
          <RegisterUsers />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/sites">
          <div></div>
        </Route>
        <Route path="/profiles">
          <div></div>
        </Route>
        <Route path="/adminManagement">
          <div></div>
        </Route>
        <Route path="/settings">
          <div></div>
        </Route>
        <Route path="/contactUs">
            <ContactUs />
        </Route>
        <Route path="/requestAccount">
            <RequestAccount />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
