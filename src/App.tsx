import React from "react";
import logo from "./logo.svg";
import "./App.scss";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TopNavBar from './components/TopNavBar';

function App() {
  return (
    <Router>
      <div>
        <TopNavBar/>
        <nav>
          <ul>
            <li>
              <Link to="/onboard">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/onboard">
            <OnBoard />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );

  function OnBoard() {
    return <h1>Onboarding</h1>;
  }

  function Dashboard() {
    return <h1>Dashboard</h1>;
  }
}

export default App;
