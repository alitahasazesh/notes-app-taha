const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

router.post("/", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  try {
    const note = new Note({
      title,
      content,
      userId: user._id,
      tags: tags || [],
    });

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note Created Successfully",
      note: note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Server Error", details: error.message });
  }
});

module.exports = router;