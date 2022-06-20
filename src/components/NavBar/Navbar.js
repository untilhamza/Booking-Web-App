import { useState } from "react"
// import { useContext } from "react"
// import AuthContext from "../../store/auth-context"
import { Navbar as RbNavbar, Container, Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"
// import Button from "@mui/material/Button"
import * as FaIcons from "react-icons/fa"
import SideBar from "../SideBar/SideBar"

import "./NavBar.css"
const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  const handleToggleSidebar = () => setShowSidebar((isShown) => !isShown)

  // const authCtx = useContext(AuthContext)
  return (
    <RbNavbar bg="dark" variant="dark" className="nav-bar">
      <Container>
        <RbNavbar.Brand className="nav-brand">
          <NavLink to="/"> Elkpro Cut</NavLink>
        </RbNavbar.Brand>
        <Nav className="ms-auto">
          <NavLink
            className="nav-link nav-item"
            activeClassName="active"
            to="/"
          >
            Booking
          </NavLink>

          {/* <NavLink className="nav-link" activeClassName="active" to="/admin">
            Admin
          </NavLink> */}
          {/* {authCtx.isLoggedIn && (
            <Button
              variant="outlined"
              onClick={() => {
                authCtx.onLogout()
              }}
            >
              Logout
            </Button>
          )} */}
        </Nav>
        <div className="nav-bars">
          <FaIcons.FaBars className="bars" onClick={handleToggleSidebar} />
        </div>
        <SideBar show={showSidebar} onToggle={handleToggleSidebar} />
      </Container>
    </RbNavbar>
  )
}

export default Navbar
