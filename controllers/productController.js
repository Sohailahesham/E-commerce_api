const Product = require("../models/productModel");
const appError = require("../utils/appError");
const getPagination = require("../utils/pagination");
const { getCategoryFilter } = require("../utils/filter");
const { isObjectIdOrHexString } = require("mongoose");

// Home Page

const getProducts = async (req, res, next) => {
  const filter = getCategoryFilter(req.query.category, next);
  const { page, limit, skip } = getPagination(req.query);
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).skip(skip).limit(limit);

  if (products.length === 0) {
    return next(appError.create("No products found", 404, "Fail"));
  }

  res.status(200).json({
    status: "success",
    results: products.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: {
      products,
    },
  });
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  if (isObjectIdOrHexString(id) === false) {
    return next(appError.create("Invalid product ID", 400, "Fail"));
  }
  const product = await Product.findById(id);

  if (!product) {
    return next(appError.create("No product found with that ID", 404, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "Product found",
    data: {
      product,
    },
  });
};

module.exports = {
  getProducts,
  getProductById,
};
