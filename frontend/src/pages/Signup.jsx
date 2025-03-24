import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { checkEmail } from "../utils/helper";
import Navbar from "../components/Navbar/Navbar";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserRegistration = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!checkEmail(email)) {
      setError("Please Enter a valid email");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password should be at least 8 characters");
      return;
    }

    try {
      const response = await axiosInstance.post("/create-account", {
        name: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected Error happend");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-[calc(100vh-70px)] flex items-center justify-center">
        <form
          className="w-[400px] border border-dashed py-6 px-6 flex flex-col gap-5"
          onSubmit={handleUserRegistration}
        >
          <h1 className="text-2xl font-semibold text-center text-gradient">
            Create an account
          </h1>
          <div className="input-container">
            <label htmlFor="" className="input-label">
              Name
            </label>
            <input
              type="text"
              className="input"
              placeholder="John Deo"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="" className="input-label">
              Email
            </label>
            <input
              type="text"
              className="input"
              placeholder="johndeo@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="" className="input-label ">
              Password
            </label>
            <input
              type="text"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>{error && <p className="text-red-500 text-sm">{error}</p>}</div>
          <button className="gradient py-2 text-white px-6 rounded-sm">
            Sign up
          </button>
          <p className="text-sm text-center text-textColor font-medium">
            Don't have an account?{" "}
            <Link
              className="text-primary underline hover:no-underline"
              to="/signin"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
