import "../App.css"
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaCompactDisc } from "react-icons/fa";


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

function NavBarToggle() {
  const [showNavBar, setShowNavBar] = useState(false);

  const toggleNavBar = () => {
    setShowNavBar(!showNavBar);
  };

  return (
    <div className="mr-8">
      <button onClick={toggleNavBar}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white mr-8"
      style={{ ":active": { backgroundColor: "white", color: "black" } }}>
        <FaCompactDisc size={30} color="#af4ca8"/>
        {/* {showNavBar ? "Hide" : "Show"} Navigation */}
      </button>
      {showNavBar && <NavBar />}
    </div>
  );
}

export default NavBarToggle;
