# 🛒 E-Commerce Online Shop API

This is a RESTful API built with Node.js, Express.js, and MongoDB for managing an online shop. It handles user authentication, product listings, cart management, order processing, and role-based admin control.

---

## 📁 Project Structure

- **app.js** – Main application file

- **config/**
  - `multerConfig.js` – Handles file upload setup using Multer

- **controllers/** – Contains all route logic
  - `adminController.js`
  - `cartController.js`
  - `orderController.js`
  - `productController.js`
  - `userController.js`

- **middlewares/** – Custom middlewares for various concerns
  - `allowedTo.js` – Restricts route access by user role
  - `asyncWrapper.js` – Handles async errors
  - `cache.js` – Caches filtered email/status responses
  - `validation.js` – Input validation logic
  - `validationArrays.js` – Express-validator rule sets
  - `verifyToken.js` – Verifies JWT token

- **models/** – MongoDB models using Mongoose
  - `cartModel.js`
  - `orderModel.js`
  - `productModel.js`
  - `userModel.js`

- **routes/** – API route definitions
  - `adminRoutes.js`
  - `cartRoutes.js`
  - `orderRoutes.js`
  - `productRoutes.js`
  - `userRoutes.js`

- **uploads/**
  - `products/` – Directory where uploaded product images are stored

- **utils/** – Utility functions and helpers
  - `appError.js` – Custom error class
  - `filter.js` – Filtering logic
  - `generateJWT.js` – JWT creation
  - `pagination.js` – Pagination support
  - `redisClient.js` – Redis connection setup

---

## 🚀 Features

- **User Authentication** (Register / Login / JWT)
- **Admin Panel** (Add / Edit / Delete Products)
- **Product Management** (CRUD operations)
- **Cart System** (Add to cart / Remove / Update)
- **Order Processing** (Checkout / View orders)
- **Role-based Access Control**
- **Image Uploading** (with Multer)
- **Redis Caching** for performance
- **Error Handling** with custom error class

---

## 🧑‍💻 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **Multer for file uploads**
- **Redis**
- **Postman** for testing

---

## 📦 Installation

1. **Clone the repo:**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a .env file:**

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

4. **Run the server:**

```bash
npm start
```

## 📷 Uploads
Product images uploaded by the admin are stored in the uploads/products/ directory.

## ✅ Future Improvements
Swagger API documentation

Payment integration

Email notifications

Admin dashboard UI

## 🤝 Contributing
Contributions, issues and feature requests are welcome!
Feel free to check the issues page.

## 📄 License
This project is licensed under the MIT License.
