const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!name) {
      return res
        .status(400)
        .json({ message: "Username is required", error: true });
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", error: true });
    }

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", error: true });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new User({
      username: name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "36000m",
    });

    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Account created successfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Server error", details: error.message });
  }
});

module.exports = router;