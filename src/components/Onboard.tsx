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
      <div className="signIn w-full h-full">
        <h1>Sign In</h1>
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

function Footer() {
  return <div></div>;
}

function Onboard() {
  return (
    <div className="h-screen">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
}

export default Onboard;