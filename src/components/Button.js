import React from "react";

import "./Button.css";
import { Link } from "react-router-dom";

const STYLES = ["button--primary", "button--outline"];

const SIZES = ["button--medium", "button--large"];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  linkPage,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <>
      <Link to={linkPage} className="button-mobile">
        <button
          className={`button ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export default Button;
