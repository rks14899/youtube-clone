import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//Sign In

// Sign In
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong credentials!"));

    // Sign JWT (expire recommended)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // e.g. 7 days
    });

    const { password, ...others } = user._doc;

    // Send token in JSON, not cookie
    res.status(200).json({ ...others, token });
  } catch (err) {
    next(err);
  }
};



// Sign Up
// Sign Up
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, ...others } = newUser._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      let message = field === "email"
        ? "Email already exists"
        : "Username already exists";
      return res.status(400).json({ message });
    }
    next(err);
  }
};





export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    }else{
      const newUser = new User({
        ...req.body,
        fromGoogle:true
      })
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
