import React from "react";
import { Link, useLocation } from "react-router-dom";

interface dynamicNavLink {
  route: string;
  name: string;
}

export function DynamicNavLink(props: dynamicNavLink) {
  let currentRoute = useLocation();

  return (
    <Link to={props.route}>
      <div
        className={`navItem ${
          currentRoute.pathname === props.route ? "active" : "inactive"
        }`}
      >
        {props.name}
      </div>
    </Link>
  );
}

interface DynamicNavBarProps {
  title: string;
  buttonAction: any;
  links: any[];
}

export default function DynamicNavbar(props: DynamicNavBarProps) {
  return (
    <div className="dynamicNavbar">
      <div className="navbarHeader">
        <div className="title">{props.title}</div>
        <div className="button" onClick={props.buttonAction}>
          +
        </div>
      </div>
      <div className="links">{props.links}</div>
    </div>
  );
}
