import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar/Navbar";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  console.log("Email:", email);
  console.log("Password: ", password);
  console.log("Error: ", error);

  const handleLoginUser = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message || 'An error occurred');
        console.log("Error:", response.data.message);
        return;
      }
      

      if (response.data && response.data.success && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard"); 
      }
    } catch (error) {
      if (error.response && error.response.message) {
        setError(error.response.message);
      }
    }
  console.log(error)
  };


  return (
    <div>
      <Navbar />
      <div className="h-[calc(100vh-70px)] flex items-center justify-center">
        <form
          className="w-[400px] border border-dashed py-6 px-6 flex flex-col gap-5"
          onSubmit={handleLoginUser}
        >
          <h1 className="text-2xl font-semibold text-center text-gradient">
            Sign in to your account
          </h1>
          <div className="input-container">
            <label htmlFor="" className="input-label">
              Email
            </label>
            <input
              type="text"
              className="input"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="" className="input-label">
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
            Sign in
          </button>
          <p className="text-sm text-center text-textColor font-medium">
            Don't have an account?{" "}
            <Link
              className="text-primary underline hover:no-underline"
              to="/signup"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
