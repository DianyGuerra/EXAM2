# BLAKBOX Tech Store - Backend API

This is a partial backend of the **BLAKBOX Tech Store**, an e-commerce platform designed to manage products, users, orders, shopping carts, payments, and shipments using **Node.js**, **Express**, and **MongoDB**.

## 📦 Features

- RESTful API for all core entities: Users, Products, Categories, Orders, Payments, Shipments, etc.
- Modular route structure for maintainability.
- MongoDB integration with Mongoose ODM.
- Environment variable management with `dotenv`.
- Real-time development with `nodemon`.

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Cloud-based)**
- **Mongoose**
- **dotenv**
- **nodemon** (development)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```
### 2. Configure your environment

Create a .env file in the root of the project and add your MongoDB connection string:

```pgsql
MONGO_URI=mongodb+srv://<your-user>:<your-password>@<your-cluster>.mongodb.net/<your-database>?retryWrites=true&w=majority
```
### 3. Start the server

```bash
npm run start
```
## 🧪 API Endpoints
All endpoints are prefixed with /api.

Examples:

♦♦♦  GET  ♦♦♦

http://ip:3007/api/products
http://ip:3007/api/users
http://ip:3007/api/orders

♦♦♦  POST  ♦♦♦

http://ip:3007/api/product
http://ip:3007/api/user
http://ip:3007/api/order

♦♦♦  PUT  ♦♦♦

http://ip:3007/api/product/:id
http://ip:3007/api/user/:id
http://ip:3007/api/order/:id

♦♦♦  DELETE  ♦♦♦

http://ip:3007/api/product/:id
http://ip:3007/api/user/:id
http://ip:3007/api/order/:id


## 👩‍💻 Author
Diana Guerra – github.com/DianyGuerra