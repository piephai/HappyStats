import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";
import { UserContext } from "../components/context/UserContext";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const [buttonText, setButtonText] = useState("SIGN UP");
  const [linkToPage, setLinkToPage] = useState("/sign-up");

  //Change the state of click to the opposite of what it is currently
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleSignOut = () => {
    if (user) {
      setClick(false);
      setUser(null);
    }
    setClick(false);
  };

  const buttonOption = () => {
    if (user) {
      setButtonText("SIGN OUT");
      setLinkToPage("/home");
    } else {
      setButtonText("SIGN UP");
      setLinkToPage("/sign-up");
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  useEffect(() => {
    buttonOption();
  }, [user]);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Happy Statistics
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/ranking"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Ranking
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/factors"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Factors
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/search"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={linkToPage}
                className="nav-links-mobile"
                onClick={handleSignOut}
              >
                {buttonText}
              </Link>
            </li>
          </ul>
          {/* Only display the below button if screen size is greater than a certain amount */}
          {button && (
            <Button
              buttonStyle="btnn--outline"
              linkPage={linkToPage}
              onClick={handleSignOut}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
