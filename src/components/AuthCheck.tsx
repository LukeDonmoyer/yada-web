/**
 * Auth verification form component
 * author: Shaun Jorstad
 *
 * fullscreen component to request signin from the user
 */
import { Button, Form, Input } from "reactstrap";
import { signInWithEmail } from "../FireConfig";
import { Animated } from "react-animated-css";
import React from "react";
import { Link } from "react-router-dom";

interface AuthCheckProps {
  additionalMessage?: string;
}

export default function AuthCheck(props: AuthCheckProps) {
  /**
   * Attempts to authenticate with the provided parameters
   * @param event Synthetic event
   */
  const handleLogin = (event: any) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    signInWithEmail(email, password).then((user) => {});
  };

  return (
    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
      <div className="h-screen custom">
        <div className="floatingCard cardSmall">
          <h1>Sign In</h1>
          {props.additionalMessage ? <p>{props.additionalMessage}</p> : <p></p>}
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
            <Link to="/request-account" className="requestLink">
              Request Account
            </Link>
            <Button type="submit" value="Submit" className="primaryButton">
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </Animated>
  );
}
