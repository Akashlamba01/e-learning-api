const CourseModel = require("../models/courseModel");
const { resp } = require("../utils/response");

const getAllCourses = async (req, res) => {
  try {
    let pageNumber = req.query.page || 1; // Get the current page number from the query parameters
    let pageSize = 10; // Number of items per page

    const courses = await CourseModel.find({}).populate(
      "admin",
      "name email gender"
    );

    let startIndex = (pageNumber - 1) * pageSize;
    let endIndex = startIndex + pageSize;

    let newData = courses.slice(startIndex, endIndex);

    if (newData.length == 0) {
      return resp.fail(res, "No More Pages!");
    }

    return resp.success(res, "Get All Courses!", {
      pageNumber: pageNumber,
      courses: newData,
    });
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const isCourse = await CourseModel.findById(courseId).populate(
      "admin",
      "name email gender"
    );

    if (!isCourse) {
      return resp.notFound(res, "Course Not Found!");
    }

    return resp.success(res, "Get Course Successfully!", isCourse);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
};
