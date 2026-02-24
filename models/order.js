const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
        book: {
            type: mongoose.Types.ObjectId,
            ref: "books",
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
        price: {
            type: Number,
        },
        title: {
            type: String,
        },
        url: {
            type: String,
        },
        status: {
            type: String,
            default: "Order Placed",
            enum: ["Order Placed", "Out for delivery", "Delivered", "Canceled"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
