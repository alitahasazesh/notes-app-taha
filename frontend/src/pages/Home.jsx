import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import FileIcon from "/images/add-note.gif";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getUser();
    return () => {}
  }, []);

  return (
    <div>
      <Navbar  />
      <div className="container mx-auto min-h-[100px] mt-4 overflow-hidden h-[500px] flex flex-col pt-32 text-center">
        <h1 className="text-8xl font-bold tracking-wide  text-gradient drop-shadow-xl">
          Noteflow
        </h1>
        <span className="bg-primary bg-opacity-[0.09] rounded-sm w-fit mx-auto py-2 px-4 text-md text-blue-400">
          A simple and efficient app to organize your notes effortlessly.
        </span>
        <br />
        <p className="text-md text-slate-600 w-[500px] text-center mx-auto font-medium">
          Welcome! It's time to bring your ideas to life. Start creating your
          next masterpiece by adding a note, uploading files, or organizing your
          thoughts. Let's get started!
        </p>
        <button className="bg-primary text-white px-5 py-2 rounded-sm w-fit gradient mx-auto mt-10 outline-none hover:from-blue-500 hover:to-blue-600">
          <Link className="outline-none" to="/signin">
            Start Creating
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
