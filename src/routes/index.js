const express = require("express");
const router = express.Router();

router.use("/user", require("./userRouter"));
router.use("/admin", require("./adminRouter"));
router.use("/course", require("./courseRouter"));

module.exports = router;
