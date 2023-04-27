import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from './components/Home'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'


function App() {
  // Code goes here!
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
