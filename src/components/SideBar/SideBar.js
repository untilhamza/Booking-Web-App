import * as AiIcons from "react-icons/ai";
import "./SideBar.css";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { Backdrop } from "@mui/material";
import { SIDEITEMS } from "../../util/data";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import styled from "styled-components";
import version from "../../version.json";

const SideBar = ({ show, onToggle }) => {
  const authCtx = useContext(AuthContext);

  const handleToggleSidebar = () => {
    onToggle();
  };
  return (
    <>
      {show && (
        <>
          <Backdrop open={show} onClick={handleToggleSidebar} />
          <IconContext.Provider value={{ color: "#fff" }}>
            <nav className="side-bar bg-dark" onClick={handleToggleSidebar}>
              <div className="side-bar__close">
                <AiIcons.AiOutlineClose className="side-bar__crossIcon" />
              </div>
              <ul className="side-list">
                {SIDEITEMS.reduce((items, item, index) => {
                  const listItem = (
                    <li className="side-list__item" key={index}>
                      <Link to={item.path} className="side-list__tag">
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                  if (!item.protected) {
                    items.push(listItem);
                  }
                  if (item.protected && authCtx.isAdmin) {
                    items.push(listItem);
                  }
                  return items;
                }, [])}
              </ul>
              <Version>Version : {version.version}</Version>
            </nav>
          </IconContext.Provider>
        </>
      )}
    </>
  );
};

export default SideBar;

const Version = styled.span`
  font-size: 0.8rem;
  color: #fff;
  margin-top: auto;
  display: block;
  text-align: center;
`;
