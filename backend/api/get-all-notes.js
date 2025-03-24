const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    console.log("New User");
    console.log(user._id);
    console.log("Get all notes donee")
    const allNotes = await Note.find({ userId: user._id }).sort({
      isPinned: -1,
    });

    return res.status(200).json({
      notes: allNotes,
      message: "All notes retreived successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server Errror" });
  }
});

module.exports = router;