import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    // <div className="background-content">
    <div className="landingpage-container">
      <h1 className="hello-text">Hello!</h1>
      <h2 className="intro">Click below to look at the happiness data</h2>
      <div className="landingpage-buttons">
        <Link to="/home">
          <button className="get-started-button"> Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
