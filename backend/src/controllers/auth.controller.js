import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

// 🔥 TOKEN + COOKIE
const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,

    // 🔥 FINAL FIX
    sameSite: "lax",
    secure: false,
    path: "/", // VERY IMPORTANT
  });
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    upsertStreamUser({
      id: user._id,
      name: user.fullName,
      image: user.profilePic,
    });

    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const user = await User.create({ email, password, fullName });

    generateToken(user._id, res);

    res.status(201).json({ user });

  } catch {
    res.status(500).json({ message: "Signup error" });
  }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
};

// ================= GET ME =================
export const getMe = (req, res) => {
  res.json({ user: req.user });
};