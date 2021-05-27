import React, { useCallback, useEffect, useState, useContext } from "react";
import AuthenticationContext from "../AuthenticationContext";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

export default function NavMenu(props){ 
  const authentication = useContext(AuthenticationContext);
  let id = authentication.getUser();
  /*let id = -1;
  if(authentication.profile){
    id = authentication.profile.id;
  }*/

  return (
    <header >
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        light
        style = {{
          background:"#4adedecd",
          height: "6vh"
        }}
      >
        <Container>
          <NavbarBrand tag={Link} to="/">
            Home
          </NavbarBrand>
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={true}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to={id == -1 ? "/" : "/myprofile"}>
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to={id == -1 ? "/" : "/generator"}>
                  Generator
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to={id == -1 ? "/" : "/settings"}>
                  Settings
                </NavLink>
              </NavItem>
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
