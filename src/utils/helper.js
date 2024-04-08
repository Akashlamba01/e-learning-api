const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_KEY);
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

function gernrateOTP(len) {
  var degits = "0123456789";
  let OTP = "";

  for (let i = 0; i < len; i++) {
    OTP += degits[Math.floor(Math.random() * 10)];
  }

  return Number(OTP);
}

const sendOtp = async (email, otp) => {
  const { data, error } = await resend.batch.send([
    {
      from: "onboarding@resend.dev",
      to: email,
      subject: "e learning verification",
      html: `<p>Your OTP is <strong>${otp}</strong> </p>`,
    },
  ]);

  // console.log(data);

  if (error) {
    return error;
  }
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: "akashlamba01", //process.env.YOUR_CLOUDINARY_CLOUD_NAME,
  api_key: 778177715938742, //process.env.YOUR_CLOUDINARY_API_KEY,
  api_secret: "y-E58nmEZbLWWrRbS_X5DLEwBUM", // process.env.YOUR_CLOUDINARY_API_SECRET,
});

const fileFilter = (req, file, cb) => {
  // Check if the file type is allowed (JPEG or PNG)
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG and PNG images are allowed!"), false); // Reject the file
  }
};

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "e-learning-api",
    public_id: (req, file) =>
      req.userData.role + "/image_" + Date.now() + "_" + req.userData.name, // Unique public ID generation
  },
});

// Create multer instance with Cloudinary storage
const parser = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
  gernrateOTP,
  sendOtp,
  parser,
};
