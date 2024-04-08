const { celebrate, Joi } = require("celebrate");
const express = require("express");
const { verifyToken } = require("../config/middleware");
const router = express.Router();
const adminController = require("../controllers/adminController");
const commenController = require("../controllers/commenController");
const { parser } = require("../utils/helper");

router.post(
  "/register",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
      adminId: Joi.string().required(), //adminauth
      gender: Joi.string().optional(),
      address: Joi.string().optional(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      confirmPassword: Joi.ref("password"),
      role: Joi.string().default("admin"),
    }),
  }),
  commenController.register
);

router.post(
  "/sendOTP",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      role: Joi.string().default("admin"),
    }),
  }),
  commenController.sendOTP
);

router.post(
  "/verifyOTP",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      role: Joi.string().default("admin"),
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
      role: Joi.string().default("admin"),
    }),
  }),
  commenController.login
);

router.get(
  "/get-profile",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("admin"),
    }),
  }),
  verifyToken,
  commenController.getProfile
);

router.post(
  "/update-profile",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("admin"),
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
  "/create-course",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("admin"),
      courseName: Joi.string().required(),
      courseType: Joi.string().required(),
      about: Joi.string().required(),
      duration: Joi.string().required(),
    }),
  }),
  verifyToken,
  adminController.createCourse
);

router.get("/get-course", verifyToken, adminController.readCourse);

router.post(
  "/update-course/:courseId",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("admin"),
      courseName: Joi.string().optional(),
      courseType: Joi.string().optional(),
      about: Joi.string().optional(),
      duration: Joi.string().optional(),
    }),
  }),
  verifyToken,
  adminController.updateCourse
);

router.post(
  "/remove-course/:courseId",
  verifyToken,
  adminController.removeCourse
);

router.post(
  "/profile-picture-upload",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string().default("admin"),
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
