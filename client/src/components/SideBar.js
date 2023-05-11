import "../App.css"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCompactDisc } from "react-icons/fa";


function SideBar({userId, showSideBar, setShowSideBar}) {
  return (
    <div>
        <nav 
        className={`${
            showSideBar
                ? "md:left-0 w-full"
                : "md:left-[-300px] w-0"
        } transition-all duration-500 ease-in-out md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 overflow-hidden`}
        style={{ left: showSideBar ? "0" : "-300px" }}>
        <button onClick={() => setShowSideBar(!showSideBar)}><FaCompactDisc /></button>
        <ul className="list-none m-0 p-0 w-56 text-white fixed h-full overflow-auto">
            <li>
                <Link exact to="/" className="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:text-purple-500 active:text-purple-500 active:bg-gray-700">
                    Home
                </Link>
            </li>
        </ul>
        {userId && userId !== '' && userId !== undefined ? (
        <ul className="list-none m-0 p-0 w-56 text-white fixed h-full overflow-auto">
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
        ) : null}
        </nav>
    </div>
  );
}



export default SideBar;