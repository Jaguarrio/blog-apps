const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/dvztpkykz/image/upload/v1672228451/noProfile_ewgkba.png",
    },
    followers: [],
    followings: [],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
