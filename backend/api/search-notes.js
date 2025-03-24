const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: true, message: "Search is required" });
    }

    const response = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      error: false,
      notes: response,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server Errror" });
  }
});

module.exports = router;