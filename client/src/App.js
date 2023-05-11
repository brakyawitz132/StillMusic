import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import Converter from "./components/Converter";
import SideBar from "./components/SideBar";


function App() {
  // Code goes here!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSideBar, setShowSideBar] = useState(false);
  const [userId, setUserId] = useState('')

  return (
    <div>
      <NavBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      <div>
      <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} userId={userId}/>
        <Routes>
          <Route exact path="/" element={<Login email={email} setEmail={setEmail} password={password} setPassword={setPassword} setShowSideBar={setShowSideBar} setUserId={setUserId}/>} />
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
