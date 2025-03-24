const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email) {
      return res
        .status(404)
        .json({ error: true, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(404)
        .json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res.status(404).json({ error: true, message: "No user found" });
    }

    const compare = await bcrypt.compare(password, userInfo.password);

    if (!compare) {
      return res
        .status(404)
        .json({ error: true, message: "Invalid Credentials" });
    }

    const user = { user: userInfo };

    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
      expiresIn: "36000m",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: userInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Server Error", details: error.message });
  }
});

module.exports = router;