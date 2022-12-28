const User = require("../models/User");
const Blog = require("../models/Blog");
const router = require("express").Router();
const passport = require("passport");
const path = require("path");
const slugify = require("slugify");
const { setHeaderJWT } = require("../middlewares/header");
const mongoose = require("mongoose");


router.get("/get-blog/:blogId", async (req, res) => {
  try {
    const blog = await Blog.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.blogId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          pipeline: [{ $project: { name: 1, profilePicture: 1 } }],
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);

    res.status(200).json(blog[0]);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          pipeline: [{ $project: { name: 1, profilePicture: 1 } }],
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.post("/create", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.user;
  const { title, content,image } = req.body;
  try {
    const blog = new Blog({ userId: _id, title, content, image });

    await blog.save();

    await blog.updateOne({ $set: { slug: slugify(`${title} ${blog._id}`) } });

    res.status(201).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.patch("/edit/:blogId", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  const { title, content, image } = req.body;
  try {
    const existBlog = await Blog.findOne({ _id: blogId, userId: _id });
    
    if (!existBlog) return res.status(404).json({ status: false, message: "Blog not found." });
    
    
    await existBlog.updateOne({ $set: { title, content, image } });
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.delete("/delete/:blogId", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  try {
    const existBlog = await Blog.findOne({ _id: blogId, userId: _id });
    if (!existBlog) return res.status(404).json({ status: false, message: "Blog not found." });

    await existBlog.deleteOne();
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.patch("/like/:blogId", setHeaderJWT, passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  try {
    const existBlog = await Blog.findOne({ _id: blogId });
    const user = await User.findOne({ _id });

    if (!user) return res.status(404).json({ status: false, message: "User not found." });
    if (!existBlog) return res.status(404).json({ status: false, message: "Blog not found." });

    if (existBlog.likes.find((_id) => _id.toString() == user._id.toString())) {
      await existBlog.updateOne({ $pull: { likes: user._id } });
    } else {
      await existBlog.updateOne({ $push: { likes: user._id } });
    }

    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

module.exports = router;
