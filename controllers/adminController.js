const appError = require("../utils/appError");
const Order = require("../models/orderModel");
const { getStatusFilter } = require("../utils/filter");
const getPagination = require("../utils/pagination");
const { isObjectIdOrHexString } = require("mongoose");
const Product = require("../models/productModel");

// products
const createProduct = async (req, res, next) => {
  const { name, description, price, category } = req.body;
  console.log("Body:", req.body);
  console.log("File:", req.file);
  const product = await Product.findOne({ name });
  if (product) {
    return next(appError.create("Product already exists", 400, "Fail"));
  }

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    imageURL: req.file.path,
  });
  await newProduct.save();
  if (!newProduct) {
    return next(appError.create("Failed to create product", 400, "Fail"));
  }
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
};

//Orders

const getAllOrders = async (req, res, next) => {
  const filter = getStatusFilter(req.query.status, next);
  const { page, limit, skip } = getPagination(req.query);
  const orders = await Order.find(filter).skip(skip).limit(limit);
  if (!orders) {
    return next(appError.create("No orders found", 404, "Fail"));
  }
  const total = await Order.countDocuments(filter);
  res.status(200).json({
    status: "success",
    results: orders.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: {
      orders,
    },
  });
};

const getOrdersByEmail = async (req, res, next) => {
  const filter = getStatusFilter(req.query.status, next);
  const { email } = req.body;
  console.log(filter);
  const orders = await Order.find({ email, ...filter });
  if (orders.length === 0) {
    return next(appError.create("No orders found", 404, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully from database",
    data: {
      orders,
    },
  });
};

const updateStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  if (isObjectIdOrHexString(orderId) === false) {
    return next(appError.create("Invalid order ID", 400, "Fail"));
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    return next(appError.create("No order found with this ID", 404, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: {
      order,
    },
  });
};

module.exports = {
  getAllOrders,
  getOrdersByEmail,
  updateStatus,
  createProduct,
};
