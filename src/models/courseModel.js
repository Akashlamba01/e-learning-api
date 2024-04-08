const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      default: "",
    },
    courseType: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
