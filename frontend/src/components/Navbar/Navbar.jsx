import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../Inputs/SearchInput";
import { gitInit } from "../../utils/helper";

const Navbar = ({ userInfo, onSearchNote, getNotes }) => {
  const [search, setSearch] = useState("");



  const handleClear = () => {
    setSearch("");
    getNotes();
  };

  const handleSearch = () => {
    if(search) {
      onSearchNote(search);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    location.reload();
  }

  return (
    <header className="px-6 h-[70px] flex items-center  border-b border-dashed ">
      <div className="bg-white flex items-center justify-between w-full">
        <div>
          {userInfo ? (
            <h1 className="text-2xl font-semibold text-primary tracking-wide">
              Noteflow
            </h1>
          ) : (
            <Link to="/">
              <h1 className="text-2xl font-semibold text-primary tracking-wide">
                Noteflow
              </h1>
            </Link>
          )}
        </div>
        {userInfo ? (
          <SearchInput
            search={search}
            setSearch={setSearch}
            onClear={handleClear}
            onSearch={handleSearch}
          />
        ) : null}
        {userInfo ? (
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
              {gitInit(userInfo.username)}
            </div>
            <div>
              <p className="capitalize text-md">{userInfo.username}</p>
              <Link className="text-sm text-primary underline" onClick={handleLogout}>Logout</Link>
            </div>
          </div>
        ) : (
          <button className="bg-primary text-white px-4 gradient py-2 rounded-sm">
            <Link to="/signin">Sign in</Link>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
