const mongoose = require("mongoose");
const CourseModel = require("../models/courseModel");
const User = require("../models/userModel");
const { resp } = require("../utils/response");

const addRemoveCourse = async (req, res) => {
  try {
    let user = req.userData;
    let courseId = req.params.courseId;

    let isCourse = await CourseModel.findById(courseId);

    if (!isCourse) {
      return resp.notFound(res, "Invalid Course Credentials!");
    }

    if (user && !user.isVerifyed) {
      return resp.fail(res, "Profile Not Verifyed!");
    }

    let newUser = await User.findOne({
      _id: user.id,
      courses: {
        $eq: isCourse.id,
      },
    });

    if (!newUser) {
      await User.findByIdAndUpdate(
        user.id,
        {
          $push: {
            courses: courseId,
          },
        },
        {
          new: true,
        }
      );

      return resp.success(res, "Course Added Succeffully!");
    } else if (newUser) {
      await User.findOneAndUpdate(
        { _id: user.id },
        {
          $pull: {
            courses: {
              $in: [courseId],
            },
          },
        }
      );

      return resp.success(res, "Course Remove Successfully!");
    } else {
      return resp.fail(res, "Somthing Wrong Try Again Letter!");
    }
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

// const removeCourse = async (req, res) => {
//   try {
//     const user = req.userData;
//     const courseId = req.params.courseId;

//     let isCourse = await CourseModel.findById(courseId);

//     if (!isCourse) {
//       return resp.notFound(res, "Course Not Found!");
//     }

//     await User.findByIdAndUpdate(user.id, {
//       $pull: {
//         courses: {
//           $in: [courseId],
//         },
//       },
//     });
//   } catch (e) {
//     return resp.fail(res, e.message);
//   }
// };

const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userData.id)
      .select("-password")
      .populate({
        path: "courses",
        populate: { path: "admin", select: "email name gender" },
      });

    if (!user) {
      return resp.fail(res, "Somthing Wrong!");
    }

    return resp.success(res, "Got All Courses!", user.courses);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

module.exports = {
  addRemoveCourse,
  getEnrolledCourses,
};
