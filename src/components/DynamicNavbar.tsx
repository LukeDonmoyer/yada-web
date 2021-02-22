import React, { ReactElement } from "react";
import { Link, Route, useLocation, useRouteMatch } from "react-router-dom";

interface dynamicNavLink {
  route: string;
  name: string;
  children: ReactElement;
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
  children: ReactElement | ReactElement[];
  defaultChild?: ReactElement;
  defaultRoute?: string;
}

export default function DynamicNavbar(props: DynamicNavBarProps) {
  function createRoute(child: ReactElement) {
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
        {props.defaultChild ? (
          <Route exact path={props.defaultRoute}>
            {props.defaultChild}
          </Route>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
