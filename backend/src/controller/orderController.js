// orderController.js — handles placing and reading orders
import Order from "../schema/orderSchema.js";

// POST /api/orders — create an order for the logged-in user (protected)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingName, shippingAddress, shippingPhone, totalPrice } = req.body;

    const result = await Order.create({
      user: req.id, // req.id comes from the isAuthenticated middleware
      items,
      shippingName,
      shippingAddress,
      shippingPhone,
      totalPrice,
    });

    res.status(201).json({ success: true, message: "Order placed successfully", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my — get all orders of the logged-in user (protected)
export const getMyOrders = async (req, res) => {
  try {
    const result = await Order.find({ user: req.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Orders fetched", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
