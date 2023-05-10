import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBarToggle from "./components/NavBar";
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import Converter from "./components/Converter";


function App() {
  // Code goes here!
  return (
    <div>
      <div>
        <NavBarToggle />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
