import React from "react";
import { Button } from "reactstrap";
import "../assets/styles.scss";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notFound h-screen">
      <div className="floatingCard cardLarge">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Link to="/">
          <Button className="filledPrimaryButton"> Return to Sign In </Button>
        </Link>
      </div>
    </div>
  );
}
