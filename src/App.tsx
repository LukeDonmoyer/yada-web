import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./tailwind.css";

import Onboard from "./components/Onboard";
import Dashboard from './components/Dashboard';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authTypes from "store/reducers/auth/authTypes";

function App() {


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
      </Switch>
    </Router>
  );
}

export default App;
