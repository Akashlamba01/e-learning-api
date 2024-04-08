const express = require("express");
require("dotenv").config();
require("./src/config/db");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", require("./src/routes"));
app.use(errors());

app.listen(PORT, () => {
  console.log(`server is running on the port: http://localhost:${PORT}`);
});
