const mongoose = require("mongoose");

mongoose
  // .connect("mongodb://127.0.0.1:27017/e-learning-api")
  // .connect(process.env.MONGO_DB_URI_LOCAL_KEY)
  .connect(process.env.MONGO_DB_URI_DATABASE_KEY)
  //mongodb://127.0.0.1:27017/SocialiaDB
  .then(() => {
    console.log("connection connected!");
  })
  .catch((e) => {
    console.log(e, "not connected!");
  });
