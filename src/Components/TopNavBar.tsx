import React, { useState } from "react";
import {
  Navbar,
  Container,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { setConstantValue } from "typescript";
import "../assets/scss/paper-dashboard.scss";

function TopNavBar(props: any) {
  return (
    <Navbar expand="lg" color="primary">
      <Container>
        <NavbarBrand>Navbar</NavbarBrand>
        <Nav navbar>
          <NavItem active>
            <NavLink to="/onboard">
              Home <span className="sr-only">(current)</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/dashboard">Features</NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;
