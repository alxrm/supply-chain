import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default () => (
  <Navbar inverse collapseOnSelect fixedTop fluid>
    <Navbar.Header>
      <LinkContainer to="/">
        <Navbar.Brand>Supply Chain</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/items">
          <NavItem>Items</NavItem>
        </LinkContainer>
        <LinkContainer to="/receive">
          <NavItem>Receive</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <NavItem href="#">Logout</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);