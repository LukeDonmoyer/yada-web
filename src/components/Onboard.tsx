import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import CustomCarousel from "./carousel";
import "../assets/styles.scss";

function Navbar() {
  return (
    <div className="custom">
      <div className="navbar">
        <span className="compName">Company Name</span>
        <ul>
          <li className="focus">Sign in</li>
          <li>
            <a href="">Contact Us</a>
          </li>
          <li>
            <a href="https://github.com/Yet-Another-Data-Aggregator/yada-web">
              Open Source Code
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SignInForm() {
  const handleLogin = (event: any) => {
    event.preventDefault();
  };
  return (
    <div className="onboardForm">
      <h1>Sign In</h1>
      <p>
        Sign in with your pre-assigned credentials. Request an account from the
        adnimistrator with the link below.
      </p>
      <Form onSubmit={handleLogin}>
        <Input
          required
          type="email"
          name="email"
          id="email"
          placeholder="email"
        />
        <Input
          required
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <Button>Sign In</Button>
        <span className="requestLink" onClick={() => {}}>
          Request Account
        </span>
      </Form>
    </div>
  );
}

function Body() {
  return (
    <div className="custom">
      <div className="grid grid-cols-2 content">
        <CustomCarousel />
        <SignInForm />
      </div>
    </div>
  );
}

function Onboard() {
  return (
    <div className="h-screen split md:grid md:grid-cols-2">
      <div className="leftSection  hidden md:block ">
        <div className="coloredBlock">
          <h1 className="w-full text-center">Company Name</h1>
          <CustomCarousel/>
        </div>
      </div>
      <div className="rightSection custom">
        <div className="">
          <ul>
            <li>
              <a href="">Contact Us</a>
            </li>
            <li>
              <a href="https://github.com/Yet-Another-Data-Aggregator/yada-web">
                Open Source Code
              </a>
            </li>
          </ul>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}

export default Onboard;
