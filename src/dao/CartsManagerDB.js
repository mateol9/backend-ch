import { cartsModel } from "./models/carts.model.js";
import { productsModel } from "./models/products.model.js";

export default class CartsManager {
  async getCarts() {
    try {
      let carts = await cartsModel.find().populate({
        path: "products.product",
        model: "products",
      });
      return carts;
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async addCart(res) {
    try {
      let cart = await cartsModel.create({ products: [] });
      return res
        .status(201)
        .json({ message: `Nuevo carrito creado, ID:${cart._id}` });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getCartById(cid, res) {
    try {
      let cart = await cartsModel.find({ _id: cid }).populate({
        path: "products.product",
        model: "products",
      });
      if (!cart.length) {
        return res
          .status(404)
          .json({ error: `No se ha encontrado un carrito con el ID: ${cid}` });
      }
      return cart;
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: error.message,
          possibleReason: "Formato de ID invalido.",
          possibleSolution:
            "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.",
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async addProduct(cid, pid, res) {
    try {
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(404)
          .json({ error: `No se ha encontrado un carrito con el ID: ${cid}` });
      }

      let product = await productsModel.findById(pid);
      if (!product) {
        return res.status(404).json({
          error: `El producto de ID: ${pid} que intentas agregar al carrito no existe en la base de datos`,
        });
      }

      let productIndex = cart.products.findIndex(
        (product) => product.product == pid
      );

      if (productIndex === -1) {
        await cartsModel.updateOne(
          { _id: cid },
          { $push: { products: { product: pid, quantity: 1 } } }
        );
        return res
          .status(201)
          .json({ message: "Producto agregado exitosamente" });
      }

      await cartsModel.updateOne(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } }
      );
      return res.status(201).json({
        message:
          "El producto ya existia en el carrito, se aumenta la cantidad en 1",
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: error.message,
          possibleReason: "Formato de ID invalido.",
          possibleSolution:
            "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.",
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async updateQuantity(cid, pid, quantity, res) {
    try {
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(404)
          .json({ error: `No se ha encontrado un carrito con el ID: ${cid}` });
      }

      let product = cart.products.findIndex(
        (product) => product.product == pid
      );

      if (product === -1) {
        return res.status(404).json({
          error: `No se ha encontrado un producto con el ID: ${pid} dentro del carrito seleccionado.`,
        });
      }

      await cartsModel.updateOne(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } }
      );
      return res
        .status(200)
        .json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: error.message,
          possibleReason: "Formato de ID invalido.",
          possibleSolution:
            "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.",
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteProduct(cid, pid, res) {
    try {
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(404)
          .json({ error: `No se ha encontrado un carrito con el ID: ${cid}` });
      }

      let product = cart.products.findIndex(
        (product) => product.product == pid
      );

      if (product === -1) {
        return res.status(404).json({
          error: `No se ha encontrado un producto con el ID: ${pid} dentro del carrito seleccionado.`,
        });
      }

      await cartsModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );
      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: error.message,
          possibleReason: "Formato de ID invalido.",
          possibleSolution:
            "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.",
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async clearCart(cid, res) {
    try {
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        return res.status(404).json({
          error: `No se ha encontrado ningun carrito con el ID: ${cid}`,
        });
      }
      await cartsModel.updateOne({ _id: cid }, { products: [] });
      return res.status(200).json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: error.message,
          possibleReason: "Formato de ID invalido.",
          possibleSolution:
            "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.",
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}
