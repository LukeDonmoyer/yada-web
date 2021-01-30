import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import authTypes from "store/reducers/auth/authTypes";
import { signInWithEmail } from "../FireConfig";

import "../assets/styles.scss";

function Navbar() {
  return (
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
  );
}

function Carousel() {
  return <div className="bg-red-400 w-full h-full"></div>;
}

function Footer() {
  return <div></div>;
}

function Onboard() {
  const currentUser = useSelector((state: any) => state.currentUser);
  const dispatch = useDispatch();

  function dispatchLogin(user: any) {
    dispatch({
      type: authTypes.SET_CURRENT_USER,
      user: user,
    });
  }

  return (
    <div className="h-screen">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );

  function Body() {
    return (
      <div className="grid grid-cols-3 content">
        <Carousel />
        <SignInForm />
      </div>
    );
  }

  function SignInForm() {
    const handleLogin = (event: any) => {
      event.preventDefault();
      const email = event.target[0].value;
      const password = event.target[1].value;
      signInWithEmail(email, password).then((user) => {
        dispatchLogin(user);
      });
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
          <Button type="submit" value="Submit">
            Sign In
          </Button>
        </Form>
        <p>Current user: {currentUser}</p>
      </div>
    );
  }
}

export default Onboard;
