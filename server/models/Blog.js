const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug: String,
    likes: [],
  },
  { timestamps: true,versionKey: false }
);

module.exports = mongoose.model("Blog", BlogSchema);
