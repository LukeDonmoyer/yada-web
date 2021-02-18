/**
 * Side navbar component
 *
 * creates navbar component that can be developed further to implement both levels of the dynamic side navbar
 */

import { fireAuthSignOut } from "FireConfig";
import React, { useState } from "react";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";

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
  items: NavItems[];
}

/**
 * props for each nav item. This is different from navItemProp because the currentRoute and currentPermission are supplied from the navbarProps
 */
export interface NavItems {
  name: string;
  route: string;
  requiredPermissions: string[];
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
  activeRoute: string;
  setActiveRoute: any;
  requiredPermissions: string[];
  currentPermission: string;
}

/**
 * Navigation item
 * @param props
 */
function NavItem(props: navItemProp) {

  /**
   * returns empty div if the permissions are not met
   */
  return props.requiredPermissions.includes(props.currentPermission) ? (
    <Link to={props.route} >
      <div
        onClick={() => {
          props.setActiveRoute(props.route)
        }}
        className={`navItem ${props.activeRoute===props.route ? "active" : "inactive"}`}
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
  let navItems = [];
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState(location.pathname);
  for (let item of props.items) {
    navItems.push(
      <NavItem
        key={item.route}
        name={item.name}
        route={item.route}
        activeRoute={activeRoute}
        setActiveRoute={setActiveRoute}
        requiredPermissions={item.requiredPermissions}
        currentPermission={props.currentPrivilege}
      />
    );
  }
  return (
    <div className="navContainer">
      <div
        className={`navPadding ${!props.autoCollapse ? "noCollapse" : ""} ${
          props.roundRightCorners ? "roundAllCorners" : "roundLeftCorners"
        }`}
      >
        <div className={`navLinks `}>{navItems}</div>
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

let defaultNavItems: NavItems[] = [
  {
    name: "home",
    route: "/dashboard",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
  {
    name: "sites",
    route: "/dashboard/sites",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
  {
    name: "profiles",
    route: "/dashboard/profiles",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
  {
    name: "user-management",
    route: "/dashboard/user-management",
    requiredPermissions: ["Owner", "Admin"],
  },
  {
    name: "settings",
    route: "/dashboard/settings",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
];
export { defaultNavItems };
