const fs = require("fs");

class Product {
  constructor(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts(limit, res) {
    if (fs.existsSync(this.path)) {
      let read = fs.readFileSync(this.path, "utf-8");
      if (res) {
        if (limit) {
          return res.status(200).json(JSON.parse(read).slice(0, limit));
        }
        return res.status(200).json(JSON.parse(read));
      }
      return JSON.parse(read);
    } else {
      return [];
    }
  }

  addProduct(
    { title, description, code, price, status, stock, category, thumbnails },
    res
  ) {
    let products = this.getProducts();
    let codeRepeat = products.find((product) => product.code === code);

    let emptyFields = !(
      title &&
      description &&
      code &&
      price &&
      status &&
      stock &&
      category
    );

    if (codeRepeat || emptyFields) {
      return res.status(400).json({
        error: codeRepeat
          ? "No se puede cargar el producto, code repetido"
          : "No se puede cargar el producto, complete todos los campos obligatorios",
      });
    }

    price = +price;
    stock = +stock;
    status = status === false ? status : true;

    let id = products.length + 1;
    // Evita que se repitan los ID al eliminar un producto y agregar otro
    while (products.some((product) => product.id === id)) {
      id++;
    }

    let newProduct = new Product(
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );

    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
    return res
      .status(201)
      .json({ message: `Producto agregado exitosamente ID: ${id}` });
  }

  getProductById(id, res) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      return res.status(400).json({
        error: `No se ha encontrado ningun producto que coincida con el ID: ${id}`,
      });
    }
    return res.status(200).json(products[productFound]);
  }

  updateProduct(id, productUpdated, res) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      return res.status(400).json({
        error: `No se puede actualizar el producto, no se ha encontrado el ID: ${id}`,
      });
    } else if (productUpdated.id) {
      return res
        .status(400)
        .json({ error: "No puedes cambiar el ID del producto" });
    } else {
      let codeRepeated = products.findIndex(
        (product) => product.code === productUpdated.code
      );
      codeRepeated !== -1
        ? res.status(400).json({ error: "El code que ingresaste ya existe." })
        : Object.assign(products[productFound], productUpdated);

      fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
      return res
        .status(200)
        .json({ message: `Producto de ID: ${id} actualizado correctamente.` });
    }
  }

  deleteProduct(id, res) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      return res.status(400).json({
        error: `No se puede eliminar el producto, no se ha encontrado el ID: ${id}`,
      });
    } else {
      products.splice(productFound, productFound + 1);
      fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
      return res.status(200).json({
        message: `Producto de ID: ${id} eliminado correctamente.`,
      });
    }
  }
}

module.exports = ProductManager;
