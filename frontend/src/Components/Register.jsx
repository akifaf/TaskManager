import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../axios/ApiServers";
import Layout from "./Layout";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Add `username` by concatenating `firstName` and `lastName`
    const registrationData = {
      ...formData,
      username: `${formData.firstName}${formData.lastName}`,
    };

    const response = await register(registrationData);

    if (response.error) {
      if (response.error.email) {
        setError(response.error.email);
      } else if (response.error.first_name) {
        setError(response.error.first_name);
      } else if (response.error.last_name) {
        setError(response.error.last_name);
      } else if (response.error.password) {
        setError(response.error.password);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
    <div className="my-5 flex items-center justify-center min-h-screen">
      <div className="bg-white place-self-center outline outline-1 w-11/12 max-w-lg flex flex-col pb-7 px-7 min-h-[550px] rounded-xl">
        <h1 className="text-3xl font-semibold mb-6">Register</h1>

        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex items-center my-3 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>

          <div className="flex items-center my-3 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>

          <div className="flex items-center my-3 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="flex items-center my-3 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div className="flex items-center my-3 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-orange-600 mb-3 text-white w-full h-14 rounded-full text-xl font-semibold"
            >
              Register
            </button>
          </div>
        </form>

        <span>Already User </span>
        <span className="text-blue-600 cursor-pointer hover:underline">
          <Link to="/login">Login</Link>
        </span>
      </div>
    </div>
    </Layout>
  );
}

export default Register;
