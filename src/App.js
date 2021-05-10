import React, { useState } from "react";
import { LastLocationProvider } from "react-router-last-location";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Ranking from "./components/pages/Ranking";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import Factors from "./components/pages/Factors";
import Home from "./components/pages/Home";
import { UserContext } from "./components/context/UserContext";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Router>
        <LastLocationProvider>
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar />
            <Switch>
              <Route path="/home" exact component={Home} />
              <Route path="/sign-up" exact component={SignUp} />
              <Route path="/ranking" exact component={Ranking} />
              <Route path="/sign-in" exact component={SignIn} />
              <Route path="/factors" exact component={Factors} />
            </Switch>
          </UserContext.Provider>
        </LastLocationProvider>
      </Router>
    </>
  );
}

export default App;
