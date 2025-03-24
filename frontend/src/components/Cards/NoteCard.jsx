import React, { useState } from "react";
import { BsPinFill } from "react-icons/bs";
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import moment from 'moment';
import axiosInstance from "../../utils/axiosInstance";

const NoteCard = ({ note, onOpenEditModal, noteId, getNotes, onUpdateIsPinned }) => {

  const [isPinned, setIsPinned] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      if(response) {
        getNotes();
      }

    } catch (error) {
      if(error.response && error.response.message) {
        console.log(error.response.message);
      } else {
        console.log("Something unexpected happend during deleting a note");
      }
    }
  } 

  



  return (
    <div className="border border-dashed p-3 hover:shadow-xl">
      <h1 className="text-md font-semibold mb-2">{note.title}</h1>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-textColor font-medium">{moment(note.createdAt).format("MMMM DD YYYY")}</p>
        <BsPinFill className={` ${note.isPinned ? "text-primary" : "text-slate-400"} hover:text-primary cursor-pointer`} onClick={onUpdateIsPinned} />
      </div>
      <p className="text-sm text-textColor">{note.content}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-textColor flex items-center flex-wrap gap-2">
          {note.tags.map((tag, index) => {
            return <span className="text-textColor" key={index}># {tag}</span>;
          })}
        </div>
        <div className="flex gap-2 text-xl text-textColor items-center">
          <button>
            <IoPencil className="text-slate-400 hover:text-green-500" onClick={onOpenEditModal} />
          </button>
          <button>
            <MdDelete className="text-slate-400 hover:text-red-500" onClick={handleDelete} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
