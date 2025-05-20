const Order = require("../models/orderModel");
const appError = require("../utils/appError");
const Product = require("../models/productModel"); // Needed to get product prices

const checkout = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) {
    return next(appError.create("Order ID is required", 400, "Fail"));
  }
  const { address } = req.body;
  const userId = req.user.id;

  const order = await Order.findOne({ userId, _id: orderId });
  if (!order) {
    return next(appError.create("Order not found", 404, "Fail"));
  }
  req.user.address = address;
  console.log(req.user);

  order.shippingAddress = address;
  await order.save();
  res.status(200).json({
    status: "success",
    message: "Order checked out successfully",
    data: {
      order,
    },
  });
};

const getOrders = async (req, res, next) => {
  const userId = req.user.id;
  const orders = await Order.find({ userId }).populate(
    "products.productId",
    "name price"
  );
  if (!orders) {
    return next(appError.create("No orders found", 404, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    data: {
      orders,
    },
  });
};

const getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    return next(appError.create("Order not found", 404, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "Order retrieved successfully",
    data: {
      order,
    },
  });
};

// const updateOrder = async (req, res, next) => {
//   const orderId = req.params.id;
//   const userId = req.user.id;
//   const { products, address } = req.body;
//   if (!orderId) {
//     return next(appError.create("Order ID is required", 400, "Fail"));
//   }

//   const order = await Order.findOne({ _id: orderId, userId });
//   if (!order) {
//     return next(appError.create("Order not found", 404, "Fail"));
//   }
//   if (order.status !== "Pending") {
//     return next(appError.create("Order cannot be updated", 400, "Fail"));
//   }
//   const orderProductIds = order.products.map((p) => p.productId.toString());
//   console.log(orderProductIds);

//   const updatedData = {};
//   if (products) {
//     const productIds = products.map((p) => p.productId);
//     productIds.forEach((id) => {
//       if (!orderProductIds.includes(id.toString())) {
//         return next(
//           appError.create(
//             `Product with id: ${id} not found in order`,
//             404,
//             "Fail"
//           )
//         );
//       }
//     });
//     const productsPrices = await Product.find({
//       _id: { $in: productIds },
//     }).select("price");
//     console.log(productsPrices);

//     const totalAmount = 0;
//     updatedData.products = products.map((product) => {
//       return {
//         productId: product.productId,
//         quantity: product.quantity,
//       };
//     });
//   }

//   if (address) {
//     updatedData.shippingAddress = address;
//   }
//   if (Object.keys(updatedData).length === 0) {
//     return next(appError.create("No data to update", 400, "Fail"));
//   }
//   const updatedOrder = await Order.findByIdAndUpdate(
//     orderId,
//     { $set: updatedData },
//     { new: true, runValidators: true }
//   );
//   res.status(200).json({
//     status: "success",
//     message: "Order updated successfully",
//     data: {
//       order: updatedOrder,
//     },
//   });
// };

const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) {
    return next(appError.create("Order ID is required", 400, "Fail"));
  }

  const userId = req.user.id;

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    return next(appError.create("Order not found", 404, "Fail"));
  }
  if (order.status !== "Pending") {
    return next(appError.create("Order cannot be updated", 400, "Fail"));
  }

  const allowedFields = ["products", "address"];
  for (let key of Object.keys(req.body)) {
    if (!allowedFields.includes(key)) {
      return next(
        appError.create(`${key} is not allowed to be updated`, 400, "Fail")
      );
    }
  }

  // Prepare product quantity updates
  const updatedQuantities = {};
  if (req.body.products) {
    for (let p of req.body.products) {
      const exists = order.products.some(
        (item) => item.productId.toString() === p.productId.toString()
      );

      if (!exists) {
        return next(
          appError.create(
            `Product with id: ${p.productId} not found in order`,
            404,
            "Fail"
          )
        );
      }

      updatedQuantities[p.productId] = p.quantity;
    }
  }

  // Recalculate total and update quantities
  let totalAmount = 0;
  const updatedProducts = [];

  for (const item of order.products) {
    const newQty = updatedQuantities[item.productId.toString()];
    if (newQty !== undefined) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      price = newQty * product.price;
      totalAmount += price;
      updatedProducts.push({
        productId: item.productId,
        price,
        quantity: newQty,
      });
    } else {
      // Keep original quantity if not updated
      const product = await Product.findById(item.productId);
      if (!product) continue;

      totalAmount += item.quantity * product.price;
      updatedProducts.push(item);
    }
  }

  const updatePayload = {
    products: updatedProducts,
    totalAmount,
  };

  if (req.body.address) {
    updatePayload.shippingAddress = req.body.address;
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updatePayload, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: {
      order: updatedOrder,
    },
  });
};

const cancelOrder = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) {
    return next(appError.create("Order ID is required", 400, "Fail"));
  }

  const userId = req.user.id;

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    return next(appError.create("Order not found", 404, "Fail"));
  }
  if (order.status !== "Pending") {
    return next(
      appError.create(`${order.status} Order cannot be cancelled`, 400, "Fail")
    );
  }

  // Update order status to "Cancelled"
  order.status = "Cancelled";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
    data: {
      order,
    },
  });
};

const cancelAllOrders = async (req, res, next) => {
  const userId = req.user.id;

  const orders = await Order.find({ userId });
  if (!orders || orders.length === 0) {
    return next(appError.create("No orders found", 404, "Fail"));
  }
  const cancelledOrders = [];
  for (const order of orders) {
    if (order.status === "Pending") {
      order.status = "Cancelled";
      await order.save();
      cancelledOrders.push(order);
    }
  }
  if (cancelledOrders.length === 0) {
    return next(appError.create("No pending orders to cancel", 400, "Fail"));
  }
  res.status(200).json({
    status: "success",
    message: "All pending orders cancelled successfully",
    data: {
      orders: orders,
    },
  });
};
module.exports = {
  checkout,
  getOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  cancelAllOrders,
};
