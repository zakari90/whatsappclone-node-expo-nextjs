import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional(),
  profilePicture: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
import { io } from "../index.js";
import User from "../models/user.js";
import { createToken } from "../utils/jwtHelpers.js";

export const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const { username, email, password, profilePicture } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const defaultProfilePicture = "/uploads/default-picture.jpg";
    const userProfilePicture = profilePicture || defaultProfilePicture;

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: userProfilePicture,
    });

    const user = newUser.toObject();
    delete user.password;

    const accessToken = createToken({ userId: user._id });

    io.emit("newUser", user);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: error.message || "Unknown error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = createToken({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userObj,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const friends = await User.find({
      _id: {
        $ne: userId,
      },
    })
      .select("-password -__v")
      .sort({ createdAt: -1 });

    if (!friends) {
      return res.status(404).json({
        success: false,
        message: "friends not found",
      });
    }
    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, status },
      { new: true },
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    io.emit("updateUser", updatedUser);

    return res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const profilePicture = "/uploads/" + req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true },
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    io.emit("updateUser", updatedUser);

    return res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
