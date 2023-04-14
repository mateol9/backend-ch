import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCol = "products";

const productsSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    code: {
      type: String,
      require: true,
      unique: true,
    },
    price: {
      type: Number,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    thumbnails: String,
  },
  { collection: "products" }
);

productsSchema.plugin(mongoosePaginate);

export const productsModel = model(productsCol, productsSchema);
