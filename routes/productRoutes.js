const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const { verifyToken } = require("../middlewares/verifyToken");
const { validator } = require("../middlewares/validation");
const allowedTo = require("../middlewares/allowedTo");
const upload = require("../config/multerConfig");
const { productValidation } = require("../middlewares/validationArrays");
// router.post("/create", asyncWrapper(createProduct));
router.route("/").get(asyncWrapper(getProducts));

router.route("/:id").get(verifyToken, asyncWrapper(getProductById));

module.exports = router;
