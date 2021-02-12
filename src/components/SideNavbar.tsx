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
      onClick={() => {navigate()}}
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
  return (
    <div className="navContainer">
      <div className={`navPadding ${!props.autoCollapse? 'noCollapse' : ''} ${props.roundRightCorners? 'roundAllCorners' : 'roundLeftCorners'}`}>
        <div className={`navLinks `}>
          <NavItem
            name={"home"}
            route={"/dashboard"}
            currentRoute={props.activeRoute}
            requiredPermissions={["Owner", "Admin", "Power", "User"]}
            currentPermission={props.currentPrivilege}
          />

          <NavItem
            name={"sites"}
            route={"/sites"}
            currentRoute={props.activeRoute}
            requiredPermissions={["Owner", "Admin", "Power", "User"]}
            currentPermission={props.currentPrivilege}
          />
          <NavItem
            name={"profiles"}
            route={"/profiles"}
            currentRoute={props.activeRoute}
            requiredPermissions={["Owner", "Admin", "Power", "User"]}
            currentPermission={props.currentPrivilege}
          />
          <NavItem
            name={"adminManagement"}
            route={"/adminManagement"}
            currentRoute={props.activeRoute}
            requiredPermissions={["Owner", "Admin"]}
            currentPermission={props.currentPrivilege}
          />
          <NavItem
            name={"settings"}
            route={"/settings"}
            currentRoute={props.activeRoute}
            requiredPermissions={["Owner", "Admin", "Power", "User"]}
            currentPermission={props.currentPrivilege}
          />
        </div>

        <div className={`navItem inactive logoutItem`} onClick={() => {fireAuthSignOut();}}>
          <div className={`navIcon logout`}></div>
          <div className="navTitle">logout</div>
        </div>
      </div>
    </div>
  );
}
