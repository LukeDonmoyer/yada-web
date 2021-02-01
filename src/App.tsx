import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./tailwind.css";
import { fireAuth, fireAuthSignOut } from "./FireConfig";

import Onboard from "./components/Onboard";
import Dashboard from "./components/Dashboard";

import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "components/ChangePassword";
import RegisterUsers from "components/RegisterUsers";

import authSlice from 'store/FireActions';
import store from './store/store';

function App() {
  const currentUser = useSelector((state: any) => state.auth.userUID);
  const history = useHistory();

  fireAuth.onAuthStateChanged((userAuth) => {
    console.log("FIREBASE STATE CHANGE");
    store.dispatch(authSlice.actions.login(userAuth?.uid));
  });

  function Logout() {
    fireAuthSignOut().then((result) => {
      history.push("/"); 
    })

    return (<div>logging out</div>)
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
            <Logout/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
