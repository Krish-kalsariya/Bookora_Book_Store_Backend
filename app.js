const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const connectToMongoDB = require("./conn/conn");

// Connect Database
connectToMongoDB();

// Import Routes
const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 Book Store API Running...");
});

// Export app (Important for Vercel)
module.exports = app;