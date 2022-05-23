import React from "react";
import { Navbar as RbNavbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <RbNavbar bg="dark" variant="dark">
      <Container>
        <RbNavbar.Brand href="/">Elkpro Cut</RbNavbar.Brand>
        <Nav className="ms-auto">
          {/* <Nav.Link href="#home">Home</Nav.Link> */}

          <NavLink className="nav-link" to="/">
            Booking
          </NavLink>

          <NavLink className="nav-link" to="/admin">
            Admin
          </NavLink>
        </Nav>
      </Container>
    </RbNavbar>
  );
};

export default Navbar;
