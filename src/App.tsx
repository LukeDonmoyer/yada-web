import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./tailwind.css";

import Onboard from "./components/Onboard";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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


  function Dashboard() {
    return <h1>Dashboard</h1>;
  }
}

export default App;
