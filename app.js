const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

app.use(cors());               // ✅ CORS added correctly
app.use(express.json());

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// ✅ PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Start on Port ${PORT}`);
});