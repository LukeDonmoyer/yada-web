import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles.scss";

export default function NotFound(){
  return (
    <div className="custom h-screen">
      <div className="floatingCard cardLarge">
        <h1>404 - Not Found!</h1>
        <Link to="/" className="requestLink">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}