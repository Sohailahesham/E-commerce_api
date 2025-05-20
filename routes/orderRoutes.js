const router = require("express").Router();
const {
  checkout,
  getOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  cancelAllOrders,
} = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/verifyToken");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const {
  addressValidation,
  updateOrderValidation,
} = require("../middlewares/validationArrays");
const { validator } = require("../middlewares/validation");

router.route("/").get(verifyToken, asyncWrapper(getOrders));

router
  .route("/cancelAllOrders")
  .patch(verifyToken, asyncWrapper(cancelAllOrders));

router
  .route("/:id")
  .get(verifyToken, asyncWrapper(getOrderById))
  .patch(
    verifyToken,
    updateOrderValidation,
    validator,
    asyncWrapper(updateOrder)
  );

router
  .route("/:id/checkout")
  .post(verifyToken, addressValidation, asyncWrapper(checkout));

router.route("/:id/cancel").put(verifyToken, asyncWrapper(cancelOrder));

module.exports = router;
