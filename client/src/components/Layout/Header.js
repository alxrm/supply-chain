import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import connectWithDispatch, {none} from '../../utils/connectWithDispatch';
import styled from 'styled-components';
import {ACCENT_COLOR, ACCENT_DARK} from '../../constants/configs';

const Brand = styled(Navbar.Brand)`
  font-weight: 900;
  cursor: pointer;
  color: white !important;
`;

const NavbarStyled = styled(Navbar)`
  background-color: ${ACCENT_COLOR};
`;

const NavItemStyled = styled(NavItem)`
  a {
    color: rgba(255,255,255, 0.85) !important;
  }

  &:hover,
  &.active {
    background-color: rgb(0, 0, 0, 0.05) !important;
  
    a {
      background-color: rgb(0, 0, 0, 0.05) !important;
      color: rgba(255,255,255, 1) !important;
    }
  }
`;

const Header = ({ logout }) => (
  <NavbarStyled collapseOnSelect fixedTop fluid>
    <Navbar.Header>
      <LinkContainer to="/">
        <Brand>supply.ch</Brand>
      </LinkContainer>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/owner">
          <NavItemStyled>Склад</NavItemStyled>
        </LinkContainer>
        <LinkContainer to="/products">
          <NavItemStyled>Товары</NavItemStyled>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <NavItemStyled onClick={logout}>Выйти</NavItemStyled>
      </Nav>
    </Navbar.Collapse>
  </NavbarStyled>
);


export default connectWithDispatch(none, { pure: false })(Header);