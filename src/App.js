import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Ranking from "./components/pages/Ranking";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import Factors from "./components/pages/Factors";
import Home from "./components/pages/Home";
import { UserContext } from "./components/context/UserContext";
import React, { useState, useMemo } from "react";

function App() {
  const [user, setUser] = useState(null);

  const providerToken = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <>
      <Router>
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
      </Router>
    </>
    // <Router>
    //   <div className="App">

    //     <div className="content">
    //       <Switch>
    //         <Route exact path="/">
    //           <LandingPage />
    //         </Route>
    //         <Route path="/home" exact component={Home} />
    //       </Switch>
    //     </div>
    //   </div>
    // </Router>
  );
}

export default App;
