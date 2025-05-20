const {
  getCart,
  addProductToCart,
  removeProductFromCart,
  clearCart,
  updateProductQuantity,
  order,
  orderAll,
} = require("../controllers/cartController");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const {
  cartValidation,
  productIdValidation,
} = require("../middlewares/validationArrays");
const { verifyToken } = require("../middlewares/verifyToken");
const { validator } = require("../middlewares/validation");

const router = require("express").Router();

router
  .route("/")
  .get(verifyToken, asyncWrapper(getCart))
  .post(verifyToken, cartValidation, validator, asyncWrapper(addProductToCart));
router
  .route("/delete")
  .delete(
    verifyToken,
    productIdValidation,
    validator,
    asyncWrapper(removeProductFromCart)
  );

router.route("/deleteAll").delete(verifyToken, asyncWrapper(clearCart));
router
  .route("/update")
  .put(
    verifyToken,
    cartValidation,
    validator,
    asyncWrapper(updateProductQuantity)
  );

router
  .route("/order")
  .post(verifyToken, productIdValidation, validator, asyncWrapper(order));
router.route("/orderAll").post(verifyToken, asyncWrapper(orderAll));

module.exports = router;
