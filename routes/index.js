const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");
require("dotenv").config(); // Load environment variables from .env file

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const secret = process.env.SECRET; // Use secret from .env file

router.post("/signUp", async (req, res) => {
  const { username, name, email, password } = req.body;
  const emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.json({
            success: false,
            message: "Error hashing password",
          });
        }
        await userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash,
        });
        return res.json({
          success: true,
          message: "User created successfully",
        });
      });
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });

  if (user) {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.json({
          success: false,
          message: "An error occurred",
          error: err,
        });
      }
      if (isMatch) {
        const token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({
          success: true,
          message: "User logged in successfully",
          token: token,
          userId: user._id,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getUserDetails", async (req, res) => {
  console.log("Called");
  const { userId } = req.body;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({
      success: true,
      message: "User details fetched successfully",
      user: user,
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/createProject", async (req, res) => {
  const { userId, title } = req.body;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    const project = await projectModel.create({
      title: title,
      createdBy: userId,
    });
    return res.json({
      success: true,
      message: "Project created successfully",
      projectId: project._id,
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  const { userId } = req.body;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    const projects = await projectModel.find({ createdBy: userId });
    return res.json({
      success: true,
      message: "Projects fetched successfully",
      projects: projects,
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/deleteProject", async (req, res) => {
  const { userId, progId } = req.body;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProject", async (req, res) => {
  const { userId, projId } = req.body;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    const project = await projectModel.findOne({ _id: projId });
    return res.json({
      success: true,
      message: "Project fetched successfully",
      project: project,
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/updateProject", async (req, res) => {
  const { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  const user = await userModel.findOne({ _id: userId });

  if (user) {
    const project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true } // This option returns the updated document
    );

    if (project) {
      return res.json({
        success: true,
        message: "Project updated successfully",
      });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

module.exports = router;
