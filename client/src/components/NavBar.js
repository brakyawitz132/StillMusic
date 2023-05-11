import "../App.css"
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCompactDisc } from "react-icons/fa";
import icon from "../data/icon.png"

// function NavBar() {
//   return (
//     <ul className="list-none m-0 p-0 w-56 text-white fixed h-full overflow-auto">
//       <li>
//         <Link exact to="/" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
//           Home
//         </Link>
//       </li>
//       <li>
//         <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
//           Dashboard
//         </Link>
//       </li>
//       <li>
//         <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
//           Profile
//         </Link>
//       </li>
//       <li>
//         <Link to="/converter" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
//           Converter
//         </Link>
//       </li>
//     </ul>
//   );
// }

function NavBar({showSideBar, setShowSideBar}) {
  const navigate = useNavigate()

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="bg-gray-800">
      <nav className="container mx-auto flex items-center justify-between flex-wrap py-4 h-auto">
        <div className="block lg:hidden">
          <button onClick={toggleSideBar} className="flex items-center px-3 py-2 border rounded text-gray-300 border-gray-300 hover:text-white hover:border-white">
            <FaCompactDisc size={30} color="#af4ca8"/>
          </button>
        </div>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <img src={icon} alt="icon" className="h-8 w-8 mr-2"/>
          <span className="font-bold text-xl tracking-tight">StillMusic</span>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
