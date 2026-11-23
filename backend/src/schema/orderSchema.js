// orderSchema.js — defines what an Order looks like in MongoDB
import { Schema, model } from "mongoose";

let orderSchema = Schema({
  // which user placed the order (reference to User collection)
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // array of items: each has a book reference + snapshot of title/price/quantity
  items: [
    {
      book: { type: Schema.Types.ObjectId, ref: "Book" },
      title: String,
      price: Number,
      quantity: Number,
    },
  ],

  // shipping details filled by user at checkout
  shippingName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  shippingPhone: { type: String, required: true },

  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

let Order = model("Order", orderSchema);

export default Order;
