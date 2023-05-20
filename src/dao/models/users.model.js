import { Schema, model } from "mongoose";

const usersCol = "users";

const usersSchema = new Schema({
  name: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: String,
});

export const usersModel = model(usersCol, usersSchema);