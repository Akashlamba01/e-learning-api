const { celebrate, Joi } = require("celebrate");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/middleware");
const userController = require("../controllers/userController");
const commenController = require("../controllers/commenController");
const courseController = require("../controllers/courseController");
const { parser } = require("../utils/helper");

router.post(
  "/register",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
      gender: Joi.string().optional(),
      address: Joi.string().optional(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      confirmPassword: Joi.ref("password"),
      role: Joi.string().default("user"),
    }),
  }),
  commenController.register
);

router.post(
  "/sendOTP",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      role: Joi.string().default("user"),
    }),
  }),
  commenController.sendOTP
);

router.post(
  "/verifyOTP",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      role: Joi.string().default("user"),
      verificationCode: Joi.number().max(999999).min(100000).required(),
    }),
  }),
  commenController.verifyOTP
);

router.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().required(),
      role: Joi.string().default("user"),
    }),
  }),
  commenController.login
);

router.get(
  "/get-profile",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("user"),
    }),
  }),
  verifyToken,
  commenController.getProfile
);

router.post(
  "/update-profile",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("user"),
      name: Joi.string().optional(),
      email: Joi.string().email().lowercase().optional(),
      gender: Joi.string().optional(),
      address: Joi.string().optional(),
    }),
  }),
  verifyToken,
  commenController.updateProfile
);

router.post("/logout", verifyToken, commenController.logOut);

router.post(
  "/add-remove-course-toggle/:courseId",
  verifyToken,
  userController.addRemoveCourse
);

router.get("/get-all-courses", courseController.getAllCourses);

router.get(
  "/get-enrolled-courses",
  verifyToken,
  userController.getEnrolledCourses
);

router.get("/get-course-by-id/:courseId", courseController.getCourseById);

router.post(
  "/profile-picture-upload",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("user"),
    }),
  }),
  verifyToken,
  parser.single("image"),
  commenController.imageUpload
);

router.post(
  "/profile-picture-delete",
  verifyToken,
  commenController.imageRemove
);

module.exports = router;
