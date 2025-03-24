const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

router.delete("/:noteId", authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

module.exports = router;