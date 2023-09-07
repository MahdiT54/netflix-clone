import React, { useEffect, useState } from "react";
import "./Nav.css";
import NavLogo from "./assets/navlogo.png";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [show, handleShow] = useState(false);
  const navigate = useNavigate();

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar); // as we scroll, its going to trigger transitionNavBar
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          onClick={() => navigate("/")}
          className="nav__logo"
          src={NavLogo}
          alt=""
        />

        <img
          onClick={() => navigate("/profile")}
          className="nav__avatar"
          src="https://media.tenor.com/sgQ73oidu1wAAAAC/netflix-avatar-smile.gif"
          alt=""
        />
      </div>
    </div>
  );
};

export default Nav;
