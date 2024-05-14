const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL_LOCAL;
(async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
})();

mongoose.connection.on("disconnected", () =>
  console.log("database disconnected")
);

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("mongodb connection closed");
  process.exit(0);
});
