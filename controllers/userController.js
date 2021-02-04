import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc     Auth User and get token
// @route    GET /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json("Invalid email or password");
    throw new Error("Invalid email or password");
  }
});

// @desc     Register new user
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobileNo } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400).json("User already exists");
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobileNo,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      mobileNo: user.mobileNo,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json("Invalid User data");
    throw new Error("Invalid User data");
  }
});

// @desc     Get User Profile
// @route    GET /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json("User not found");
    throw new Error("User not found");
  }
});

// @desc     Get All Users
// @route    GET /api/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

// @desc     Get User By Id
// @route    GET /api/users/:id
// @access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404).json("User not found");
    throw new Error("User Not Found");
  }
});

// @desc     Update User By ID
// @route    PUT /api/users/:id
// @access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobileNo = req.body.mobileNo || user.mobileNo;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobileNo: user.mobileNo,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json("User not found");
    throw new Error("User not found");
  }
});

// @desc     Delete user
// @route    Delete /api/users/:id
// @access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User Removed" });
  } else {
    res.status(404).json("Not authorized as an admin");
    throw new Error("User Not Found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobileNo = req.body.mobileNo || user.mobileNo;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobileNo: user.mobileNo,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json("User not found");
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
