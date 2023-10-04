const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const convertRouter = require("./routes/convertRouter.js");



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/convert", convertRouter);

app.listen(5000, () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to db"))
    .catch((err) => {});
});