const express = require("express");
const { jwtAuthMiddleware, generateJwtToken } = require("../jwt");
const User = require("../models/user");

const signup = async (req, res) => {
  try {
    const data = req.body;
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    // Validate Aadhar Card Number must have exactly 12 digit
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }

    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with the same Aadhar Card Number already exists",
      });
    }
    const newUser = new User(data);
    const response = await newUser.save();
    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateJwtToken(payload);
    console.log("new item saved", response);
    res.status(201).json({
      message: "signup created successfully",
      user: response,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    // Check if aadharCardNumber or password is missing
    if (!aadharCardNumber || !password) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number and password are required" });
    }

    const user = await User.find({ aadharCardNumber: aadharCardNumber });

    if (!user && !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid aadhar card number and password" });
    }
    const payload = {
      id: user.id,
    };
    const token = generateJwtToken(payload);
    console.log("item fetched successfully");
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userData = req.body;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res
        .status(401)
        .json({ error: "Invalid aadhar card number and password" });
    }
    user.password = newPassword;
    await User.save();
    console.log("password updated successfully");
    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { signup, login, getProfile, updatePassword };
