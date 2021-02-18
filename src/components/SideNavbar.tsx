/**
 * Side navbar component
 *
 * creates navbar component that can be developed further to implement both levels of the dynamic side navbar
 */

import { fireAuthSignOut } from "FireConfig";
import { useHistory } from "react-router-dom";

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
  activeRoute: string;
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
  currentRoute: string;
  requiredPermissions: string[];
  currentPermission: string;
}

/**
 * Navigation item
 * @param props
 */
function NavItem(props: navItemProp) {
  const history = useHistory();

  /**
   * click handler than navigates to the new route
   */
  function navigate() {
    history.push(props.route);
  }

  /**
   * returns empty div if the permissions are not met
   */
  return props.requiredPermissions.includes(props.currentPermission) ? (
    <div
      onClick={() => {
        navigate();
      }}
      className={`navItem ${
        props.route === props.currentRoute ? "active" : "inactive"
      }`}
    >
      <div className={`navIcon ${props.name}`}></div>
      <div className="navTitle">{props.name}</div>
    </div>
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
  for (let item of props.items) {
    navItems.push(
      <NavItem
        key={item.route}
        name={item.name}
        route={item.route}
        currentRoute={props.activeRoute}
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
    route: "/sites",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
  {
    name: "profiles",
    route: "/profiles",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
  {
    name: "user-management",
    route: "/user-management",
    requiredPermissions: ["Owner", "Admin"],
  },
  {
    name: "settings",
    route: "/settings",
    requiredPermissions: ["Owner", "Admin", "Power", "User"],
  },
];
export { defaultNavItems,};
