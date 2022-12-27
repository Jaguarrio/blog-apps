require("dotenv").config();
const { MONGODB_URI, CLIENT_URL , PORT } = process.env;

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(passport.initialize());
app.use("/public", express.static(path.join(__dirname, "./public")));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");

require("./configs/passport");

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI).then(() => {
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/blog", blogRoutes);

  app.listen(PORT || 4001, () => console.log("SERVER :",PORT || 4001));
});
