import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

const SearchInput = ({ search, setSearch, onClear, onSearch }) => {
  return (
    <div className="w-80 flex items-center py-2 px-2 bg-[#f6f4f4] rounded-sm">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent outline-none w-full text-sm pl-2 text-textColor"
      />
      {search ? (
        <IoIosClose className="text-xl text-textColor cursor-pointer" onClick={onClear} />
      ) : (
        null
      )}
      <IoSearchSharp className="text-xl text-textColor cursor-pointer" onClick={onSearch} />
    </div>
  );
};

export default SearchInput;
