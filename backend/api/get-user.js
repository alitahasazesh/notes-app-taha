const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities.js");

const User = require("../models/User");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const isUser = await User.findById(user._id);

    if (!isUser) {
      return res.sendStatus(401);
    }

    res.status(200).json({
      user: {
        username: isUser.username,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;