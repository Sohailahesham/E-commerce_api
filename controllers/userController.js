const User = require("../models/userModel");
const AppError = require("../utils/appError");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/generateJWT");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisClient");
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(AppError.create("Email already exists", 400, "fail"));
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ name, email, password: hashedPassword });
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  user.refreshToken = refreshToken;
  await user.save();
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      user: user,
      accessToken: accessToken,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(AppError.create("Invalid email or password", 401, "fail"));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(AppError.create("Invalid email or password", 401, "fail"));
  }
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  user.refreshToken = refreshToken;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      user: user,
      accessToken: accessToken,
    },
  });
};

const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(AppError.create("Refresh token is required", 401, "fail"));
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err) {
      return next(AppError.create("Invalid refresh token", 401, "fail"));
    }
  });

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return next(AppError.create("Invalid refresh token", 401, "fail"));
  }
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  res.status(200).json({
    status: "success",
    message: "Access token refreshed successfully",
    data: {
      accessToken: accessToken,
    },
  });
};

const logout = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  // Decode to get expiry
  const decoded = jwt.decode(token);
  const expiresAt = decoded?.exp;

  if (!expiresAt) {
    return next(new AppError("Invalid token", 400));
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = expiresAt - now; // Time until expiry in seconds

  await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
    data: null,
  });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
