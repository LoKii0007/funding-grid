const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Company = require("./models/Data");
const dotenv = require("dotenv");
const { uploadCompanyData, getCompanyData, uploadSingle } = require("./controller/CompanyData");
const { signup, login } = require("./controller/auth");
const { verifyUser } = require("./utilities/middleware");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

connectToDatabase();

// Auth Routes
// app.post("/signup", signup);
app.post("/login", login);

// company data routes
app.post("/upload-csv",verifyUser, uploadCompanyData);
app.post("/api/single-upload", verifyUser, uploadSingle);

// Fetch existing data
app.get("/data", verifyUser, getCompanyData);

app.listen(5000, () => console.log("Server running on port 5000"));
