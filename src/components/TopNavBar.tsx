import React from 'react';
import { Navbar, Container, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';

import "../assets/scss/paper-dashboard.scss";

class TopNavBar extends React.Component{
    constructor(props:any) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }
    toggle() {
        this.setState({
            isOpen: true
        });
    }
    render(){
        return(
            <Navbar expand="lg" color="primary">
                <Container>
                    <NavbarBrand>Navbar</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                    </NavbarToggler>
                    <Collapse isOpen={true} navbar>
                        <Nav navbar>
                            <NavItem active>
                                <NavLink to="#pablo">
                                    Home <span className="sr-only">(current)</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="#pablo">
                                    Features
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="#pablo">
                                    Pricing
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="#pablo" disabled>
                                    Disabled
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default TopNavBar;