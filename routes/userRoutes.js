const express = require("express");
const router = express.Router();

const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const { findById } = require("../models/candidate");

// POST routes to add User

router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //requested body contain the User data

    const newUser = new User(data);
    //to ensure only one admin is there to login
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }
    const response = await newUser.save();
    console.log("Data saved");

    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is:", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract adharCardnumber and password from request body
    const { adharCardnumber, Password } = req.body;

    // Find the user by username
    const user = await User.findOne({ adharCardnumber: adharCardnumber });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(Password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generate Token
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    // resturn token as response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; //this will extract id from the token
    const { currentpassword, updatedPassword } = req.body; //extract current and newpassword from request body
    const user = await User.findById(userId);
    //if password doesnt match return error
    if (!user || !(await user.comparePassword(Password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    user.password = newPassword;
    await user.save();

    console.log("Password updated");
    res.status(200).json({ message: "password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
