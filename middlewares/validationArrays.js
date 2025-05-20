const { body } = require("express-validator");

// User validation arrays

const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&_]/)
    .withMessage(
      "Password must contain at least one special character (@, $, !, %, *, ?, &, _)"
    )
    .not()
    .matches(/\s/)
    .withMessage("Password must not contain spaces"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Product validation arrays

const productValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Electronics", "Clothing", "Home", "Books", "Sports"])
    .withMessage("Invalid category"),
  body("imageURL").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Only JPEG, PNG, JPG, and WEBP images are allowed");
    }
    return true;
  }),
];

// cart validation arrays

const cartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .isLength({ max: 2 })
    .withMessage("Quantity must be at most 2 digits long"),
];

const productIdValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
];

const addressValidation = [
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10 })
    .withMessage("Address must be at least 10 characters long")
    .isLength({ max: 100 })
    .withMessage("Address must be at most 100 characters long"),
];

const updateOrderValidation = [
  // Optional, but if provided must be an array of objects with valid productId and quantity
  body("products")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  body("products.*.productId")
    .if(body("products").exists())
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),

  body("products.*.quantity")
    .if(body("products").exists())
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0"),

  // Optional, but if provided, must be valid
  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .isLength({ min: 10, max: 100 })
    .withMessage("Address must be between 10 and 100 characters"),
];

const orderIdValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID format"),
];

const emailValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const statusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status"),
];

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  cartValidation,
  productIdValidation,
  addressValidation,
  updateOrderValidation,
  orderIdValidation,
  emailValidation,
  statusValidation,
};
