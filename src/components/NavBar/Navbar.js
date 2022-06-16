import React from "react"
import { useContext } from "react"
import AuthContext from "../../store/auth-context"
import { Navbar as RbNavbar, Container, Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import Button from "@mui/material/Button"

import "./NavBar.css"
const Navbar = () => {
  const authCtx = useContext(AuthContext)
  return (
    <RbNavbar bg="dark" variant="dark" className="nav-bar">
      <Container>
        <RbNavbar.Brand>
          <NavLink to="/"> Elkpro Cut</NavLink>
        </RbNavbar.Brand>
        <Nav className="ms-auto">
          <NavLink className="nav-link" activeClassName="active" to="/">
            Booking
          </NavLink>

          <NavLink className="nav-link" activeClassName="active" to="/admin">
            Admin
          </NavLink>
          {authCtx.isLoggedIn && (
            <Button
              variant="outlined"
              onClick={() => {
                authCtx.onLogout()
              }}
            >
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </RbNavbar>
  )
}

export default Navbar
