import React from "react";
import "./LoginScreen.css";
import NavLogo from "../assets/navlogo.png";

const LoginScreen = () => {
  return (
    <div className="loginScreen">
      <div className="loginScreen__background">
        <img className="loginScreen__logo" src={NavLogo} alt="" />
      </div>
    </div>
  );
};

export default LoginScreen;
