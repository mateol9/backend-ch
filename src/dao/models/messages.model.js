import { Schema, model } from "mongoose";

const messagesCol = "messages";

const messagesSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const messagesModel = model(messagesCol, messagesSchema);
