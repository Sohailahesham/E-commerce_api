const appError = require("../utils/appError");

// This middleware checks if the user has the required role to access a route
// It takes in a list of roles and checks if the user's role is included in that list

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        appError.create(
          "You are not allowed to perform this action",
          403,
          "Fail"
        )
      );
    }
    next();
  };
};
