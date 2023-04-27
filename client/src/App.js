import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from './components/Home'


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
