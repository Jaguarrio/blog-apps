const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/User");
const router = require("express").Router();
const { setHeaderJWT } = require("../middlewares/header");
const upload = require("../configs/image");

router.get("/get-user/:userId", async (req, res) => {
  try {
    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.userId) } },
      { $project: { password: 0 } },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "userId",
          as: "blogs",
        },
      },
    ]);

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.get("/get-users", async (req, res) => {
  try {
    const aggregate = [
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "userId",
          as: "blogs",
        },
      },
      { $project: { name: 1, profilePicture: 1, followers: { $size: "$followers" }, blogs: { $size: "$blogs" } } },
    ];

    if (req.query.search) aggregate.unshift({ $match: { name: { $regex: req.query.search, $options: "i" } } });

    const users = await User.aggregate(aggregate);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.get("/get-users-following", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ status: false, message: "not found user" });

    const users = await Promise.all(user.followings.map((userId) => User.findOne({ _id: userId }).select("name profilePicture")));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.patch("/follow/:userId", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const userTarget = await User.findOne({ _id: req.params.userId });

    if (!user) return res.status(404).json({ status: false, message: "User not found." });
    if (!userTarget) return res.status(404).json({ status: false, message: "User not found." });

    if (
      userTarget.followers.find((_id) => _id.toString() == user._id.toString()) &&
      user.toJSON().followings.find((_id) => _id.toString() == userTarget._id.toString())
    ) {
      await user.updateOne({ $pull: { followings: userTarget._id } });
      await userTarget.updateOne({ $pull: { followers: user._id } });
    } else {
      await user.updateOne({ $push: { followings: userTarget._id } });
      await userTarget.updateOne({ $push: { followers: user._id } });
    }

    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.patch("/update-profile", setHeaderJWT, passport.authenticate("jwt", { session: false }), upload.single("profilePicture"), async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { profilePicture: `/public/images/${req.user._id}/${req.file.filename}` } });

    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

module.exports = router;
