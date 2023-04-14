import { productsModel } from "./models/products.model.js";

class Products {
  constructor(
    status,
    payload,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink
  ) {
    this.status = status;
    this.payload = payload;
    this.totalPages = totalPages;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.page = page;
    this.hasPrevPage = hasPrevPage;
    this.hasNextPage = hasNextPage;
    this.prevLink = prevLink;
    this.nextLink = nextLink;
  }
}

export default class ProductManager {
  async getProducts(limit, currentPage, category, status, sort) {
    try {
      const filters = {};

      const options = {
        limit: limit || 10,
        page: currentPage || 1,
      };

      if (sort === "asc" || sort === "desc") {
        options.sort = { price: sort };
      }

      if (category) {
        filters.category = category;
      }

      if (status === "true" || status === "false") {
        filters.status = status;
      }

      let {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        page,
        prevPage,
        nextPage,
      } = await productsModel.paginate(filters, options);

      const baseURL = `/products?limit=${limit || 10}`;
      const nextLink = hasNextPage ? `${baseURL}&page=${nextPage}` : null;
      const prevLink = hasPrevPage ? `${baseURL}&page=${prevPage}` : null;

      const products = new Products(
        "success",
        docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      );

      return products;
    } catch (error) {
      const products = new Products("error");
      return products;
    }
  }

  async addProduct(
    { title, description, code, price, status, stock, category, thumbnails },
    res
  ) {
    try {
      let codeRepeat = await productsModel.find({ code: code });

      let emptyFields = !(
        title &&
        description &&
        code &&
        price &&
        status &&
        stock &&
        category
      );

      if (codeRepeat.length || emptyFields) {
        return res.status(400).json({
          error: codeRepeat.length
            ? "No se puede cargar el producto, code repetido"
            : "No se puede cargar el producto, complete todos los campos obligatorios",
        });
      }

      await productsModel.create({
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails,
      });

      return res
        .status(201)
        .json({ message: `Producto agregado exitosamente` });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getProductById(id, res) {
    try {
      let product = await productsModel.findById(id);

      if (!product) {
        return res.status(404).json({
          error: `No se ha encontrado ningun producto que coincida con el ID: ${id}`,
        });
      }
      return res.status(200).json({ product });
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

  async updateProduct(id, productUpdated, res) {
    try {
      let product = await productsModel.find({ _id: id });

      if (!product.length) {
        return res.status(400).json({
          error: `No se puede actualizar el producto, no se ha encontrado el ID: ${id}`,
        });
      }
      let codeRepeat = await productsModel.find({
        code: productUpdated.code,
      });
      if (codeRepeat.length) {
        return res.status(400).json({
          error: `No se puede actualizar el producto, code repetido`,
        });
      }
      await productsModel.updateOne({ _id: id }, { $set: productUpdated });
      return res.status(200).json({
        message: `Producto de ID: ${id} actualizado correctamente.`,
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

  async deleteProduct(id, res) {
    try {
      let product = await productsModel.find({ _id: id });
      if (!product.length) {
        return res.status(404).json({
          error: `No se puede eliminar el producto, no se ha encontrado el ID: ${id}`,
        });
      }
      await productsModel.deleteOne({ _id: id });
      return res.status(200).json({
        message: `Producto de ID: ${id} eliminado correctamente.`,
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
}
