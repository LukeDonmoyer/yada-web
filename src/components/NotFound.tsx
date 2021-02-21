import React from "react";
import "../assets/styles.scss";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notFound h-screen">
      <div className="card grid grid-cols-2 md:grid-cols-2">
        <div className="flex items-center">
          <div>
            <h1>404</h1>
            <h2>Page Not Found</h2>
          </div>
        </div>
        <div className="grid justify-items-end gap-4">
          <li>
            <Link to="/">Sign In</Link>
          </li>
          <li>
            <Link to="/app">Dashboard</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
          <li>
            <Link to="/request-account">Request Account</Link>
          </li>
        </div>
      </div>
    </div>
  );
}
