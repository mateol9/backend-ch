import { Schema, model } from "mongoose";

const usersCol = "users";

const usersSchema = new Schema({
  name: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: Schema.Types.ObjectId, ref: "carts" },
  role: String,
  github: Boolean,
  githubProfile: Object,
});

export const usersModel = model(usersCol, usersSchema);
