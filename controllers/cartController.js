const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const appError = require("../utils/appError");
const Order = require("../models/orderModel");

const addProductToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) return next(appError.create("Product not found", 404));

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  const existingIndex = cart.products.findIndex(
    (item) => item.productId._id.toString() === productId
  );

  if (existingIndex > -1) {
    cart.products[existingIndex].quantity += quantity;
    cart.products[existingIndex].price += product.price * quantity;
  } else {
    cart.products.push({
      productId,
      quantity,
      price: product.price * quantity,
    });
  }
  await cart.save();

  const totalPrice = cart.products.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    data: {
      cart,
      totalPrice,
    },
  });
};

const getCart = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have user ID from the token

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(appError.create("Cart is empty", 404, "Fail"));
  }

  const totalPrice = cart.products.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: {
      cart,
      totalPrice,
    },
  });
};

const removeProductFromCart = async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart) {
    return next(appError.create("Cart is empty", 404, "Fail"));
  }

  const productIndex = cart.products.findIndex(
    (item) => item.productId._id.toString() === productId
  );

  if (productIndex === -1) {
    return next(appError.create("Product not found in cart", 404, "Fail"));
  }

  cart.products.splice(productIndex, 1);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    data: { cart },
  });
};

const clearCart = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have user ID from the token
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(appError.create("Cart is empty", 404, "Fail"));
  }

  await cart.deleteOne({ userId });
  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: null,
  });
};

const updateProductQuantity = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assuming you have user ID from the token

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(appError.create("Cart is empty", 404, "Fail"));
  }
  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (productIndex === -1) {
    return next(appError.create("Product not found in cart", 404, "Fail"));
  }
  cart.products[productIndex].price =
    (cart.products[productIndex].price / cart.products[productIndex].quantity) *
    quantity;
  cart.products[productIndex].quantity = quantity;

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product quantity updated",
    data: {
      cart,
    },
  });
};

const order = async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;
  const email = req.user.email;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(appError.create("Cart not found", 404, "Fail"));
  }
  const product = cart.products.find(
    (item) => item.productId.toString() === productId
  );
  if (!product) {
    return next(appError.create("Product not found in cart", 404, "Fail"));
  }
  const order = new Order({
    userId,
    email,
    products: [product],
    totalAmount: product.price,
  });
  await order.save();
  cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "please checkout your order",
    data: {
      order,
    },
  });
};

const orderAll = async (req, res, next) => {
  const { id, email } = req.user;
  const cart = await Cart.findOne({ userId: id });
  if (!cart) {
    return next(appError.create("Cart not found", 404, "Fail"));
  }
  const order = new Order({
    userId: id,
    email,
    products: cart.products,
    totalAmount: cart.products.reduce((total, item) => total + item.price, 0),
  });
  await order.save();
  await Cart.deleteMany({ userId: id });
  res.status(201).json({
    status: "success",
    message: "please checkout your order",
    data: {
      order,
    },
  });
};

module.exports = {
  addProductToCart,
  getCart,
  removeProductFromCart,
  clearCart,
  updateProductQuantity,
  order,
  orderAll,
};
