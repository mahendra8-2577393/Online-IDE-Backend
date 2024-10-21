// Load environment variables from .env file
require('dotenv').config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Add this option if you want to avoid warnings
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
