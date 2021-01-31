import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./tailwind.css";
import { fireAuth } from "./FireConfig";

import Onboard from "./components/Onboard";
import Dashboard from "./components/Dashboard";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authTypes from "store/reducers/auth/authTypes";
import ChangePassword from "components/ChangePassword";

function App() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const dispatch = useDispatch();
  function dispatchLogin(user: any) {
    dispatch({
      type: authTypes.SET_CURRENT_USER,
      payload: user,
    });
  }

  fireAuth.onAuthStateChanged((userAuth) => {
    console.log("FIREBASE STATE CHANGE");
    console.log(userAuth);
    dispatchLogin(userAuth);
  });

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          <Onboard />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/changePassword">
          <ChangePassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
