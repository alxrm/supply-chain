import React from 'react';
import {Nav, Navbar, NavItem} from "react-bootstrap";

export default () => (
  <Navbar inverse collapseOnSelect fixedTop fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Supply Chain</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">Items</NavItem>
        <NavItem eventKey={2} href="#">History</NavItem>
        <NavItem eventKey={3} href="#">Receive</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);