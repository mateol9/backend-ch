import { Schema, model } from "mongoose";

const cartsCol = "carts";

const cartsSchema = new Schema({
  code: {
    type: String,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
        unique: false,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

cartsSchema.pre("find", function () {
  this.populate("products.product");
});

export const cartsModel = model(cartsCol, cartsSchema);
