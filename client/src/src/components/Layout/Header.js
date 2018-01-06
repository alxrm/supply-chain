import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {mapDispatchToProps} from "../../actions";
import {connect} from "react-redux";

const Header = ({ logout }) => (
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
        <NavItem onClick={logout}>Logout</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);


export default connect(() => ({}), mapDispatchToProps)(Header);