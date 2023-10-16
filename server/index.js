const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const convertRouter = require("./routes/convertRouter.js");
const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());
app.use(express.json());
app.use("/convert", convertRouter);

app.listen(5000);
