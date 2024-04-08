const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    accessToken: {
      type: String,
      default: "",
    },
    isVerifyed: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    verificationCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

User.findOne({
  role: "admin",
}).then((res) => {
  if (!res) {
    User.create({
      email: "admin@gmail.com",
      password: "25d55ad283aa400af464c76d713c07ad", //12345678
      role: "admin",
      accessToken: jwt.sign(
        {
          email: "admin@gmail.com",
        },
        "supersecret"
      ),
      isVerifyed: true,
    });
  }
});

module.exports = User;
