const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");

const {
  signup,
  login,
  getProfile,
  updatePassword,
} = require("../controller/users-controller");

router
  .post("/signup", signup)
  .post("/login", login)
  .get("/profile", jwtAuthMiddleware, getProfile)
  .put("/profile/password", jwtAuthMiddleware, updatePassword);

module.exports = router;
