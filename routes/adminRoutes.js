const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const {
  getAllOrders,
  getOrdersByEmail,
  updateStatus,
  createProduct,
} = require("../controllers/adminController");
const allowedTo = require("../middlewares/allowedTo");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const { cache } = require("../middlewares/cache");
const {
  emailValidation,
  statusValidation,
  productValidation,
} = require("../middlewares/validationArrays");
const { validator } = require("../middlewares/validation");
const upload = require("../config/multerConfig");

router
  .route("/products")
  .post(
    verifyToken,
    allowedTo("ADMIN"),
    upload.single("imageURL"),
    productValidation,
    validator,
    asyncWrapper(createProduct)
  );

router
  .route("/orders")
  .get(verifyToken, allowedTo("ADMIN"), asyncWrapper(getAllOrders));
router
  .route("/orders/email")
  .post(
    verifyToken,
    allowedTo("ADMIN"),
    emailValidation,
    validator,
    cache,
    asyncWrapper(getOrdersByEmail)
  );
router
  .route("/orders/:orderId/status")
  .patch(
    verifyToken,
    allowedTo("ADMIN"),
    statusValidation,
    validator,
    asyncWrapper(updateStatus)
  );

module.exports = router;
