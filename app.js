require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const adminRouter = require("./routes/adminRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
// console.log(crypto.randomBytes(64).toString("hex", 16));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("./uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", adminRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || "error",
    message: err.message || "Internal Server Error",
    code: err.statusCode || 500,
  });
});
