# 🛒 E-Commerce Online Shop API

This is a RESTful API built with Node.js, Express.js, and MongoDB for managing an online shop. It handles user authentication, product listings, cart management, order processing, and role-based admin control.

---

## 📁 Project Structure

app.js – Main entry point of the application

config/

multerConfig.js – Handles image upload configuration

controllers/ – Request handlers and business logic

adminController.js

cartController.js

orderController.js

productController.js

userController.js

middlewares/ – Custom middleware functions

allowedTo.js – Role-based access control

asyncWrapper.js – Wrapper to catch async errors

cache.js – Redis caching middleware

validation.js – Request validation logic

validationArrays.js – Express-validator schemas

verifyToken.js – JWT verification middleware

models/ – Mongoose data models

cartModel.js

orderModel.js

productModel.js

userModel.js

routes/ – API route definitions

adminRoutes.js

cartRoutes.js

orderRoutes.js

productRoutes.js

userRoutes.js

uploads/ – Uploaded product images

products/ – Stores uploaded product images

utils/ – Utility/helper functions

appError.js – Custom error class

filter.js – Filtering utility

generateJWT.js – Token generation helper

pagination.js – Pagination helper

redisClient.js – Redis client configuration


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
