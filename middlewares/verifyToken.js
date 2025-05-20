const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const redisClient = require("../utils/redisClient");

const verifyToken = async (req, res, next) => {
  const token =
    req.headers["Authorization"] || req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return next(appError.create("Token is Missing", 401, "Fail"));
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
      return next(appError.create("Token has been blacklisted", 403, "Fail"));
    }
    const currentUser = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = currentUser;
    next();
  } catch (error) {
    return next(appError.create("Invalid token", 403, "Fail"));
  }
};

module.exports = { verifyToken };
