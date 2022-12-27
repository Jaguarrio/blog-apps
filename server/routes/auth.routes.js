const { hashSync, compareSync } = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { setHeaderJWT } = require("../middlewares/header");
const passport = require("passport");
const router = require("express").Router();

const { ACCESS_KEY, REFRESH_KEY, ACCESS_EXPIRE, REFRESH_EXPIRE } = process.env;

let refreshTokens = [];

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(401).json({ status: false, message: "The user already exists." });

    const newUser = new User({
      name,
      email,
      password: hashSync(password, 10),
    });

    await newUser.save();

    res.status(201).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(401).json({ status: false, message: "Email or password incorrect" });

    if (!compareSync(password, existUser.password)) return res.status(401).json({ status: false, message: "Email or password incorrect" });

    const accessToken = jwt.sign({ _id: existUser._id.toString(), email: existUser.email }, ACCESS_KEY, { expiresIn: ACCESS_EXPIRE });
    const refreshToken = jwt.sign(
      {
        _id: existUser._id.toString(),
        name: existUser.name,
        email: existUser.email,
        profilePicture: existUser.profilePicture,
        followings: existUser.followings.length,
        followers: existUser.followers.length,
      },
      REFRESH_KEY,
      { expiresIn: REFRESH_EXPIRE }
    );

    refreshTokens.push({ _id: existUser._id.toString(), email: existUser.email, token: refreshToken });

    res.cookie("token", accessToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: true , sameSite: "none" });

    res.status(201).send({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.delete("/logout", setHeaderJWT, passport.authenticate("jwt", { session: false }), (req, res) => {
  const { _id, email } = req.user;

  refreshTokens = refreshTokens.filter((item) => item.email != email && item._id != _id);
  res.clearCookie("token");
  res.end();
});

router.post("/get-token", setHeaderJWT, passport.authenticate("jwt", { session: false }), (req, res) => {
  const { _id, email } = req.user;

  const existToken = refreshTokens.find((item) => item.email == email && item._id == _id.toString());
  if (!existToken) return res.status(401).json({ status: false });

  jwt.verify(existToken.token, REFRESH_KEY, async (err, data) => {
    if (err) return res.status(401).json({ status: false });
    if (!data) return res.status(401).json({ status: false });

    refreshTokens = refreshTokens.filter((item) => item.email != data.email && item._id != data._id);
    res.clearCookie("token");

    const existUser = await User.findOne({ _id: data._id });

    const dataUser = {
      _id: existUser._id.toString(),
      name: existUser.name,
      email: existUser.email,
      profilePicture: existUser.profilePicture,
      followings: existUser.followings,
      followers: existUser.followers,
    };

    const accessToken = jwt.sign({ _id: data._id, email: data.email }, ACCESS_KEY, { expiresIn: ACCESS_EXPIRE });
    const refreshToken = jwt.sign(dataUser, REFRESH_KEY, { expiresIn: REFRESH_EXPIRE });

    refreshTokens.push({ _id: data._id, email: data.email, token: refreshToken });
    res.cookie("token", accessToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

    res.status(200).json(dataUser);
  });
});

module.exports = router;
