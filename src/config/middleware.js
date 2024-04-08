const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");

  // console.log(token);

  if (!token) {
    return res.status(400).json({
      message: "Token not provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    //process.env.JWT_SECRET
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }

    const user = await User.findOne({ accessToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token!",
        success: false,
      });
    }

    req.userData = user;
    // console.log(user);
    next();
  });
};

module.exports = {
  verifyToken,
};
