import React, { useEffect, useState } from "react";

import NoteCard from "../components/Cards/NoteCard";
import AddEditNote from "../components/Cards/AddEditNote";
import Modal from "react-modal";
import { IoIosAdd } from "react-icons/io";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/signin");
      }
    }
  };

  const getNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log("Error in fetching notes");
    }
  };

  useEffect(() => {
    getUser();
    getNotes();
    return () => {};
  }, []);

  const handleEditPinned = async (note) => {
    try {
      const response = await axiosInstance.put(
        `/edit-pinned-note/${note._id}`,
        {
          isPinned: !note.isPinned,
        }
      );

      if (response.data) {
        getNotes();
      }
    } catch (error) {
      if (error.response && error.response.message) {
        console.log(error.response.message);
      } else {
        console.log("Something unexpected happend during deleting a note");
      }
    }
  };

  const getNotesBySearch = async (query) => {
    try {
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }

      console.log(notes);
    } catch (error) {
      console.log("Unexpected error during searching notes", error.message);
    }
  };

  return (
    <div>
      <Navbar getNotes={getNotes} userInfo={userInfo} onSearchNote={getNotesBySearch} />
      <div className="container mx-auto">
        {notes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 ">
              {notes.map((note) => {
                return (
                  <NoteCard
                    note={note}
                    noteId={note._id}
                    getNotes={getNotes}
                    onUpdateIsPinned={() => handleEditPinned(note)}
                    onOpenEditModal={() =>
                      setOpenAddEditModal({
                        isShown: true,
                        type: "edit",
                        data: note,
                      })
                    }
                    key={note._id}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <p>No notes, Start </p>
        )}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              background: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="w-[40%] bg-white max-h-3/4 mx-auto mt-10 p-6 "
        >
          <AddEditNote
            type={openAddEditModal.type}
            data={openAddEditModal.data}
            getNotes={getNotes}
            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }}
          />
        </Modal>
        <button
          className="h-[50px] w-[50px] rounded-sm fixed bottom-8 right-8 flex items-center justify-center text-white bg-primary"
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
            console.log("Hello");
          }}
        >
          <IoIosAdd className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
