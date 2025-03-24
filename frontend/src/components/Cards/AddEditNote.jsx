import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNote = ({ onClose, getNotes, type, data }) => {
  const [title, setTitle] = useState(data?.title || "");
  const [content, setContent] = useState(data?.content || "");
  const [tags, setTags] = useState(data?.tags || []);
  const [tagValue, setTagValue] = useState("");

  const handleAddTag = () => {
    if (tagValue !== "") {
      setTags([...tags, tagValue]);
      setTagValue("");
    }
  };

  const handleEnter = (e) => {
    if (tagValue === "") return;
    if (e.key === "Enter") {
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  
  const handleAddNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags: tags || []
      });
      
      if(response.data) {
        getNotes();
        onClose();
      }
    } catch (error) {
      if(error.response && error.response.message) {
        console.log(error.response.message)
      }
    }
  }

  const handleEditNote = async () => {

    const noteId = data._id;

    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags: tags || []
      });
      
      if(response.data) {
        getNotes();
        onClose();
      }
    } catch (error) {
      if(error.response && error.response.message) {
        console.log(error.response.message)
      }
    }
  }


  const handleNoteOperations = () => {
    if(type === "add") {
      handleAddNote();
    } else {
      handleEditNote();
    }
  }


  return (
    <div className="relative">
      <div className="flex gap-4 flex-col">
        <IoIosClose
          className="absolute -top-4 -right-2 text-3xl text-slate-500 cursor-pointer"
          onClick={onClose}
        />
        <div className="flex gap-2 flex-col">
          <h1 className="text-lg text-slate-400">Title</h1>
          <input
            className="input text-2xl"
            type="title"
            value={title}
            placeholder="Going to gym at 5"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="text-lg text-slate-400">Content</h1>
          <textarea
            className="input h-[200px]"
            type="title"
            value={content}
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="text-lg text-slate-400">TAGS</h1>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 py-1 pl-2 px-1 rounded-sm bg-[rgba(0,0,0,0.08)] text-sm text-textColor w-fit"
                >
                  {tag}{" "}
                  <IoIosClose
                    className="text-xl cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              className="input"
              type="text"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              onKeyUp={handleEnter}
            />
            <button
              className="border text-xl p-2 hover:bg-primary hover:text-white"
              onClick={handleAddTag}
            >
              <IoIosAdd />
            </button>
          </div>
          <button
            className="w-full bg-primary py-2 rounded-sm text-white mt-2"
            onClick={handleNoteOperations}
          >
            {type === "edit" ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNote;
