/**
 * Side navbar component
 *
 * creates navbar component that can be developed further to implement both levels of the dynamic side navbar
 */

import { fireAuthSignOut } from "FireConfig";
import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * autoCollapse: if true, the navbar compresses itself and expands when hovered. Ideal if icons are used
 * roundRightCornser: if true, all 4 corners of the navbar are rounded. if false on the left two are. This will need to be expanded upon later if this component is used to create multiple levels of navbars
 * currentPrivilege: privilege of the current user
 * active route: the active route
 */
interface navbarProps {
  autoCollapse: Boolean;
  roundRightCorners: Boolean;
  currentPrivilege: string;
  items: any[];
}

/**
 * name: text to display on the nav item
 * route: the route switched to upon clicking the nav item
 * currentRoute: the current route the user is on (used to highlight the current route)
 * requiredPermissions: permissions required to navigate to this route
 * currentPermission: permission level of the current user
 */
interface navItemProp {
  name: string;
  route: string;
  requiredPermissions: string[];
  currentPermission: string;
}

/**
 * Navigation item
 * @param props
 */
export function NavItem(props: navItemProp) {
  let currentRoute = useLocation();
  /**
   * returns empty div if the permissions are not met
   */
  return props.requiredPermissions.includes(props.currentPermission) ? (
    <Link to={props.route}>
      <div
        className={`navItem ${
          currentRoute.pathname === props.route ? "active" : "inactive"
        }`}
      >
        <div className={`navIcon ${props.name}`}></div>
        <div className="navTitle">{props.name}</div>
      </div>
    </Link>
  ) : (
    <div></div>
  );
}

/**
 * Side navbar
 * @param props
 */
export default function SideNavbar(props: navbarProps) {
  return (
    <div className="navContainer">
      <div
        className={`navPadding ${!props.autoCollapse ? "noCollapse" : ""} ${
          props.roundRightCorners ? "roundAllCorners" : "roundLeftCorners"
        }`}
      >
        <div className={`navLinks `}>{props.items}</div>
        <div
          className={`navItem inactive logoutItem`}
          onClick={() => {
            fireAuthSignOut();
          }}
        >
          <div className={`navIcon logout`}></div>
          <div className="navTitle">logout</div>
        </div>
      </div>
    </div>
  );
}
