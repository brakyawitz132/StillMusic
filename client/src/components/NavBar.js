import "../App.css"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCompactDisc } from "react-icons/fa";


function NavBar() {
  return (
    <ul className="list-none m-0 p-0 w-56 text-white fixed h-full overflow-auto">
      <li>
        <Link exact to="/" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
          Home
        </Link>
      </li>
      <li>
        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
          Profile
        </Link>
      </li>
      <li>
        <Link to="/converter" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
          Converter
        </Link>
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
    <div className=" pl-2 pt-2">
      <button onClick={toggleNavBar}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white"
        style={{ ":active": { backgroundColor: "white", color: "black" } }}>
        <FaCompactDisc size={30} color="#af4ca8"/>
      </button>
      {showNavBar && <NavBar />}
    </div>
  );
}

export default NavBarToggle;
