/**
 * Side navbar component
 */

import { changePassword, fireAuth, fireAuthSignOut } from "FireConfig";
import { useHistory } from "react-router-dom";

interface navbarProps {
  autoCollapse: Boolean;
  roundRightCorners: Boolean;
  currentPrivilege: string;
  activeRoute: string;
}

interface navItemProp {
  name: string;
  route: string;
  currentRoute: string;
  requiredPermissions: string[];
  currentPermission: string;
}

function NavItem(props: navItemProp) {
  const history = useHistory();

  function navigate() {
    history.push(props.route);
  }

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
