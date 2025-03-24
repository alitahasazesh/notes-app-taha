const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

router.put("/:noteId", authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(
      noteId,
      { $set: req.body },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

module.exports = router;