// express
const express = require("express");
const app = express();
// mongoose
const mongoose = require("mongoose");
// models
const User = require("./models/User");
const Note = require("./models/Note");
// imports
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
// jwt

// cors
const cors = require("cors");
// Routes
const loginRoute = require("./api/signin.js");
const createAccountRoute = require("./api/signup.js");
const getUserRoute = require("./api/get-user.js");
const addNoteRoute = require("./api/add-note.js");
const editNoteRoute = require("./api/edit-note.js");
const deleteNoteRoute = require("./api/delete-note.js");
const editPinnedNoteRoute = require("./api/edit-pinned-note.js");
const getAllNotesRoute = require("./api/get-all-notes.js");
const searchNotesRouter = require("./api/search-notes.js");

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ data: "Hello" });
});

app.use("/login", loginRoute);
app.use("/create-account", createAccountRoute);
app.use("/get-user", getUserRoute);
app.use("/add-note", addNoteRoute);
app.use("/edit-note", editNoteRoute);
app.use("/delete-note", deleteNoteRoute);
app.use("/edit-pinned-note", editPinnedNoteRoute);
app.use("/get-all-notes", getAllNotesRoute);
app.use("/search-note", searchNotesRouter);

app.listen(8000, () => {
  console.log("Server created");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to Db"));
