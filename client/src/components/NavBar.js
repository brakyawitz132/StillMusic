import "../App.css"
import React from "react";
import {NavLink} from "react-router-dom"


function NavBar() {
    return (
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" activeClassName="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/converter" activeClassName="active">
            Converter
          </NavLink>
        </li>
      </ul>
    );
  }

export default NavBar;