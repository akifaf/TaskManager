import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../axios/ApiServers";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser()
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  const authLinks = (
    <>
      <li className="nav-item">
        <button onClick={handleLogout} className="">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <NavLink className="" to="/login">
          Login
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="" to="/register">
          Register
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-gray-200 p-4">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto">
        <NavLink to="/" className="text-2xl font-semibold ">
          Home
        </NavLink>

        <ul className="flex gap-6">
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
