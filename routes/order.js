const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        for (const orderData of order) {
            // read qty from payload (frontend sends `qty`) and save a snapshot of book data
            const qty = orderData.qty || 1;
            const newOrder = new Order({
                user: id,
                book: orderData._id,
                quantity: qty,
                price: orderData.price,
                title: orderData.title,
                url: orderData.url,
            });

            const orderDataFromDb = await newOrder.save();

            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id },
            });

            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }

        return res.json({
            status: "Success",
            message: "Order Placed Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred", });
    }
});



//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        if (!userData) {
            return res.status(404).json({ status: "Fail", message: "User not found" });
        }

        const ordersData = userData.orders.reverse();

        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.error("Error in get-order-history:", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});



//get-all-orders ---admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: "book",
            })
            .populate({
                path: "user",
            })
            .sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: "Error",
                message: "Status is required",
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                status: "Error",
                message: "Order not found",
            });
        }

        return res.json({
            status: "Success",
            message: "Status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error",
        });
    }
});

module.exports = router;