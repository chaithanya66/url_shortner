# 🔗 URL Shortener – Backend

![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express.js-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

This is the **backend** for a URL Shortener application, built using **Node.js**, **Express**, and **MongoDB**.  
It provides REST APIs for generating short URLs and redirecting users to the original URLs.

---

## 🚀 Live API
[🔗 View Live API](ttps://url-shortner-1-73j8.onrender.com)  

---

## 📌 Features
- **POST /api/shorten** – Accepts a long URL and returns a shortened URL
- **GET /:shortcode** – Redirects to the original long URL
- **MongoDB storage** for URLs
- **Error handling** for invalid or missing URLs
- **CORS enabled** for frontend integration

---

## 🛠️ Tech Stack
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB + Mongoose** – Database and ORM
- **dotenv** – Environment variable management
- **shortid / nanoid** – Unique short code generation

---

## 📂 Project Structure
