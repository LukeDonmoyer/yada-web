import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./tailwind.css";
import { fireAuth } from "./FireConfig";

import Onboard from "./components/Onboard";
import Dashboard from "./components/Dashboard";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "components/ChangePassword";
import RegisterUsers from "components/RegisterUsers";

import authSlice from 'store/FireActions';
import store from './store/store';

function App() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);

  fireAuth.onAuthStateChanged((userAuth) => {
    console.log("FIREBASE STATE CHANGE");
    console.log(userAuth);
    store.dispatch(authSlice.actions.login(userAuth));
  });

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
      </Switch>
    </Router>
  );
}

export default App;
