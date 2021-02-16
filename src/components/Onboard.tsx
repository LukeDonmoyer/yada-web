/**
 * Onboarding component
 * author: Shaun Jorstad
 *
 * route: '/'
 * purpose: home page with an info carousel that provides the login form and some links to resources.
 */

import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import { Button, Form, Input } from "reactstrap";
import { signInWithEmail, getUserData } from "../FireConfig";

import "../assets/styles.scss";
import { RootState } from "../store/rootReducer";

/**
 * Navbar component
 */
function Navbar() {
  return (
    <div className="navbar">
      <span className="compName">Company Name</span>
      <ul>
        <li className="focus">Sign in</li>
        <li>
          <Link to='/contact-us'>Contact Us</Link>
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

/**
 * component placeholder for the carousel
 */
function Carousel() {
  return <div className="bg-red-400 w-full h-full"></div>;
}

/**
 * Onboard
 * @param props
 */
function Onboard(props: RouteComponentProps) {
  // current user uid, null or undefined if not logged in
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const history = useHistory();

  // if the user is logged in, they are redirected to changing their password on initial login, or are directed to the location specified by the ?redirect flag, or are directed to the dashboard
  if (!(currentUser === null || currentUser === undefined)) {
    const uid = currentUser;
    getUserData(uid).then((userData) => {
      if (userData.defaults) {
        history.push("/change-password");
      } else {
        let properties = props.location.search.split("=");
        if (
          properties[0].includes("redirect") &&
          ["changePassword", "registerUsers"].includes(properties[1])
        ) {
          let address = "/" + properties[1];
          history.push(address);
        } else {
          history.push("/dashboard");
        }
      }
    });
  }

  return (
    <div className="h-screen">
      <Navbar />
      <Body />
    </div>
  );

  function Body() {
    return (
      <div className="grid grid-cols-2 content">
        <Carousel />
        <SignInForm />
      </div>
    );
  }

  function SignInForm() {
    /**
     * handles user login
     * @param event synthetic event
     */
    const handleLogin = (event: any) => {
      event.preventDefault();
      const email = event.target[0].value;
      const password = event.target[1].value;
      signInWithEmail(email, password).then((user) => {});
    };
    return (
      <div className="signIn w-full h-full">
        <h1>Sign In</h1>
        <Form onSubmit={handleLogin}>
          <Input
            className="styledPrimaryInput"
            required
            type="email"
            name="email"
            id="email"
            placeholder="email"
          />
          <Input
            className="styledPrimaryInput"
            required
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
          <Link to="/request-account" className="requestLink">Request Account</Link>
          <Button type="submit" value="Submit" className="primaryButton">
            Sign In
          </Button>
        </Form>
      </div>
    );
  }
}

export default Onboard;
