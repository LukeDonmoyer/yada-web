import { fireAuthSignOut, getUserPrivilege } from "FireConfig";
import React, { useState } from "react";
import { Animated } from "react-animated-css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/rootReducer";
import AuthCheck from "./AuthCheck";
import SideNavbar, { NavItems } from "./SideNavbar";

interface topLevelProps {
  privilege: string;
  currentRoute: string;
  navItems: NavItems[];
  children: any;
}

function ContentWithTopLevelNavbar(props: topLevelProps) {
  return (
    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
      <div className="withSideNavbar">
        <SideNavbar
          autoCollapse={true}
          roundRightCorners={true}
          currentPrivilege={props.privilege}
          items={props.navItems}
        />
        {props.children}
      </div>
    </Animated>
  );
}

function ContentWithDynamicNavbar() {}

export { ContentWithTopLevelNavbar, ContentWithDynamicNavbar };
