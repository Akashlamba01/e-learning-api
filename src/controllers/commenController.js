const { findByIdAndUpdate } = require("../models/courseModel");
const User = require("../models/userModel");
const { gernrateOTP, sendOtp } = require("../utils/helper");
const { resp } = require("../utils/response");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const register = async (req, res) => {
  try {
    if (req.body.role == "admin") {
      if (req.body.adminId !== "adminauth") {
        return resp.unauthorized(res, "Admin Not Authorized!");
      }
    }

    let user = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });

    if (user && user.isVerifyed == true) {
      resp.taken(res);
    }

    console.log(req.body);

    req.body.accessToken = jwt.sign(
      {
        email: req.body.email,
      },
      process.env.JWT_SECRET //process.env.JWT_SECRET
    );

    const OTP = 123456; //Math.floor(100000 + Math.random() * 900000)
    // const OTP = gernrateOTP(6)

    // sendOtp(req.body.email, OTP);

    req.body.verificationCode = md5(OTP);
    req.body.password = md5(req.body.password);

    let newUser = {};

    if (user && user.isVerifyed == false) {
      newUser = await User.findByIdAndUpdate(user.id, req.body, {
        new: true,
      });
    } else {
      newUser = await User.create(req.body);
    }

    return resp.success(res, "OTP Sent Successfully!");
  } catch (e) {
    console.log(e);
    return resp.fail(res, e.message);
  }
};

const sendOTP = async (req, res) => {
  try {
    // const OTP = gernrateOTP(6);
    const OTP = 123456;

    let isUser = await User.findOneAndUpdate(
      {
        email: req.body.email,
        role: req.body.role,
      },
      {
        $set: {
          verificationCode: OTP,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!isUser) return resp.notFound(res, "User Not found!");

    return resp.success(
      res,
      "Successfully Sent OTP To Registered Email!",
      isUser
    );
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const verificationCode = md5(req.body.verificationCode);

    const isUser = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });

    if (!isUser) return resp.notFound(res, "User Not found!");

    if (verificationCode != isUser.verificationCode) {
      return resp.unknown(res, "Invalid Credentials!");
    }

    const user = await User.findByIdAndUpdate(
      isUser.id,
      {
        verificationCode: "",
        isVerifyed: true,
      },
      {
        new: true,
      }
    )
      .select("-password")
      .lean(true);

    return resp.success(res, "Otp Verifyed Successfully!", user);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const login = async (req, res) => {
  try {
    req.body.accessToken = jwt.sign(
      {
        email: req.body.email,
      },
      process.env.JWT_SECRET //process.env.JWT_SECRET
    );

    let query = {
      email: req.body.email,
      role: req.body.role,
      password: md5(req.body.password),
      isVerifyed: true,
    };

    const user = await User.findOneAndUpdate(
      query,
      {
        accessToken: req.body.accessToken,
      },
      {
        new: true,
      }
    )
      .select("-password")
      .lean(true);
    // console.log(user);
    if (!user) return resp.fail(res, "Invalid Credntail!");

    return resp.success(res, "Loged In Successfully!", user);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const logOut = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.userData.id,
      {
        $set: {
          accessToken: "",
        },
      },
      {
        new: true,
      }
    );

    return resp.success(res, "Loged Out Successfully!");
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.userData._id,
      role: req.userData.role,
    })
      .select("-password")
      .lean(true);

    if (!user) {
      return resp.unauthorized(res, "Invalid User");
    }

    return resp.success(res, "User Get Successfully!", user);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.userData.email,
      role: req.body.role,
    });

    if (!user) return resp.notFound(res, "User Not Found!");

    if (user.isVerifyed !== true) {
      return resp.fail(res, "User not Verifyed!");
    }

    req.body.accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    const updatedUser = await User.findByIdAndUpdate(user.id, req.body, {
      new: true,
    })
      .select("-password")
      .lean(true);

    return resp.success(res, "User Updated Successfully!", updatedUser);
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

const imageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return resp.fail(res);
    }

    let user = await User.findByIdAndUpdate(
      req.userData.id,
      {
        $set: {
          profilePicture: req.file.path,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return resp.fail(res);
    }

    return resp.success(res, "Profile Updated Successfully!", user);
  } catch (e) {
    return resp.fail(res, "Image Not uploaded!");
  }
};

const imageRemove = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.userData.id,
      {
        $set: {
          profilePicture: "",
        },
      },
      {
        new: true,
      }
    );

    return resp.success(res, "Profile Deleted Successfully!");
  } catch (e) {
    return resp.fail(res, e.message);
  }
};

module.exports = {
  register,
  sendOTP,
  verifyOTP,
  login,
  logOut,
  getProfile,
  updateProfile,
  imageUpload,
  imageRemove,
};
