const router = require("express").Router();
const {
  register,
  login,
  refreshAccessToken,
  logout,
} = require("../controllers/userController");

const { validator } = require("../middlewares/validation");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validationArrays");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const { verifyToken } = require("../middlewares/verifyToken");

router
  .route("/register")
  .post(registerValidation, validator, asyncWrapper(register));
router.route("/login").post(loginValidation, validator, asyncWrapper(login));
router.route("/token").post(asyncWrapper(refreshAccessToken));
router.route("/logout").post(verifyToken, asyncWrapper(logout));

module.exports = router;
