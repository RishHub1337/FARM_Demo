import React from "react";
import { Link } from "react-router-dom";

const AnchorTag = ({ children, path }) => {
  return (
    <Link className="text-emerald-100 hover:text-emerald-300 font-light" to={path}>
      {children}
    </Link>
  );
};

const Header = () => {
  return (
    <div className="relative ">
      <header className="absolute flex justify-center w-full h-[8vh] items-center shadow-xl ">
        <nav className="relative text-base sm:text-3xl sm:flex gap-48">
          <AnchorTag path={"/sign-up"}>
            <span>Create Account</span>
          </AnchorTag>
          <AnchorTag path={"/sign-in"}>
            <span>Log In</span>
          </AnchorTag>
        </nav>
      </header>
    </div>
  );
};

export default Header;
