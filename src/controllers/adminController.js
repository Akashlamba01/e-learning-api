const User = require("../models/userModel");
const CourseModel = require("../models/courseModel");
const { resp } = require("../utils/response");

//uxHPRadF0T8PP741

const createCourse = async (req, res) => {
  try {
    const admin = req.userData;
    if (admin.role !== "admin") {
      return resp.unauthorized(res, "User Not Authorized");
    }

    const isCourseExists = await CourseModel.findOne({
      courseName: req.body.courseName,
      courseType: req.body.courseType,
    });

    if (isCourseExists) {
      return resp.taken(res, "Course Already in Database!");
    }

    const newCourse = await CourseModel.create({
      courseName: req.body.courseName,
      courseType: req.body.courseType,
      duration: req.body.duration,
      about: req.body.about,
      admin: admin._id,
    });

    return resp.success(res, "Course Created Successfully!", newCourse);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const readCourse = async (req, res) => {
  try {
    const admin = req.userData;
    if (admin.role !== "admin") {
      return resp.unauthorized(res, "User Not Authorized");
    }

    const courses = await CourseModel.find({}).populate("admin", {
      email: 1,
      name: 1,
    });

    return resp.success(res, "Get Couses Successfully!", courses);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const updateCourse = async (req, res) => {
  try {
    const admin = req.userData;
    const courseId = req.params.courseId;

    // console.log(admin);

    let isCourse = await CourseModel.findById(courseId);
    if (!isCourse) {
      return resp.notFound(res, "Course Not Found!");
    }

    if (isCourse.admin.toString() != admin._id) {
      return resp.unauthorized(res, "Not Authorazed!");
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      isCourse.id,
      req.body,
      {
        new: true,
      }
    ).lean(true);

    return resp.success(res, "Course Updated Successfully!", updatedCourse);
  } catch (e) {
    return resp(res, e.message);
  }
};

const removeCourse = async (req, res) => {
  try {
    const admin = req.userData;
    const courseId = req.params.courseId;

    let isCourse = await CourseModel.findById(courseId);
    if (!isCourse) {
      return resp.notFound(res, "Course Not Found!");
    }

    if (isCourse.admin.toString() != admin._id) {
      return resp.unauthorized(res, "Not Authorazed!");
    }

    await User.updateMany(
      {},
      {
        $pull: {
          courses: {
            $in: [courseId],
          },
        },
      }
    );

    const updatedCourse = await CourseModel.findByIdAndDelete(courseId);

    return resp.success(res, "Course Deleted Successfully!");
  } catch (e) {
    return resp(res, e.message);
  }
};

module.exports = {
  createCourse,
  readCourse,
  updateCourse,
  removeCourse,
};
