import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Ranking from "./components/pages/Ranking";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/sign-up" exact component={SignUp} />
          <Route path="/ranking" exact component={Ranking} />
          <Route path="/sign-in" exact component={SignIn} />
        </Switch>
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
