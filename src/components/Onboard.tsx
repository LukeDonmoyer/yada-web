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

import { ReactComponent as Logo } from "../assets/images/icon.svg"

import CustomCarousel from "./carousel";
import "../assets/styles.scss";
import { RootState } from "../store/rootReducer";

function SignInForm() {
  const handleLogin = (event: any) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    signInWithEmail(email, password).then((user) => {});
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
        <span className="requestLink">
          <Link to="/requestAccount" className="requestButton">Request Account</Link>
        </span>
      </Form>
    </div>
  );
}

/**
 * Onboard
 * @param props
 */
function Onboard(props: RouteComponentProps) {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const history = useHistory();

  // if the user is logged in, they are redirected to changing their password on initial login, or are directed to the location specified by the ?redirect flag, or are directed to the dashboard
  if (!(currentUser === null || currentUser === undefined)) {
    const uid = currentUser;
    getUserData(uid).then((userData) => {
      if (userData.defaults) {
        history.push("/changePassword");
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
    <div className="h-screen split md:grid md:grid-cols-2">
      <div className="leftSection  hidden md:block ">
        <div className="coloredBlock">
          <h1 className="w-full text-center">Company Name</h1>
          {/* <CustomCarousel /> */}
          <Logo className="mx-auto my-20"/>
        </div>
      </div>
      <div className="rightSection custom onboard">
        <div className="">
          <ul>
            <li>
              <Link to='/contactUs'>Contact Us</Link>
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
