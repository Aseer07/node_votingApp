const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users-route");
const candidateRoutes = require("./routes/candidates-route");
// const { jwtAuthMiddleware } = require("./jwt");

require("dotenv").config();
const app = express();
require("./db-connect");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
