const express = require("express");
const {
  getAllCourses,
  getCourseById,
} = require("../controllers/courseController");
const router = express.Router();

router.get("/get-course-by-id/:courseId", getCourseById);

router.get("/get-all-courses", getAllCourses);

module.exports = router;
