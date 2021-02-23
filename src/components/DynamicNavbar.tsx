import React, { ReactElement } from "react";
import { Link, Route, useLocation, useRouteMatch } from "react-router-dom";

interface dynamicNavLink {
  route: string;
  name: string;
  children: ReactElement;
  blockLinkRender?: boolean;
}

export function DynamicNavLink(props: dynamicNavLink) {
  let currentRoute = useLocation();

  if (props.blockLinkRender) {
    return <></>;
  }

  return (
    <Link to={props.route}>
      <div
        className={`navItem ${
          currentRoute.pathname.startsWith(props.route) ? "active" : "inactive"
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
  children: ReactElement | ReactElement[];
}

export default function DynamicNavbar(props: DynamicNavBarProps) {
  function createRoute(child: ReactElement) {
    if (child.props.blockLinkRender) {
      return (
        <Route exact path={child.props.route}>
          {child.props.children}
        </Route>
      );
    }
    return <Route path={child.props.route}>{child.props.children}</Route>;
  }

  return (
    <>
      <div className="dynamicNavbar">
        <div className="navbarHeader">
          <div className="title">{props.title}</div>
          <div className="button" onClick={props.buttonAction}>
            +
          </div>
        </div>
        <div className="links">{props.children}</div>
      </div>
      <div className="routes">
        {React.Children.map(props.children, createRoute)}
      </div>
    </>
  );
}
