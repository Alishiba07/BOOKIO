// userSchema.js — defines what a User looks like in MongoDB
import { Schema, model } from "mongoose";

let userSchema = Schema({
  name: { type: String, required: [true, "name is required"] },
  email: { type: String, required: [true, "email is required"], unique: true },
  password: { type: String, required: [true, "password is required"] },
  phone: { type: String },
  address: { type: String },
});

let User = model("User", userSchema);

export default User;
