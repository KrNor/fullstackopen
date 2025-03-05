require("dotenv").config();
const express = require("express");

const config = require("./utils/config");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
