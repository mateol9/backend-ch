const fs = require("fs");

class Product {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      let read = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(read);
    } else {
      return [];
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let products = this.getProducts();
    let codeRepeat = products.find((product) => product.code === code);

    let emptyFields = !(
      title &&
      description &&
      price &&
      thumbnail &&
      code &&
      stock
    );

    if (codeRepeat || emptyFields) {
      console.log(
        "Error: No se puede cargar el producto, code repetido o campo vacio"
      );
      return;
    }

    let id = products.length + 1;
    // Evita que se repitan los ID al eliminar un producto y agregar otro
    while (products.some((product) => product.id === id)) {
      id++;
    }

    let newProduct = new Product(
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );

    products.push(newProduct);
    console.log(`Producto agregado exitosamente ID: ${id}`);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
  }

  getProductById(id) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      console.log(
        "Error: No se ha encontrado ningun producto que coincida con el ID: " +
          id
      );
    } else {
      console.log("Se ha encontrado un producto que coincide con el ID: " + id);
      console.log(products[productFound]);
    }
  }

  updateProduct(id, productUpdated) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      console.log(
        "Error: No se puede actualizar el producto, no se ha encontrado el ID: " +
          id
      );
    } else {
      // Reemplaza unicamente las propiedades enviadas por parametros. Si se intenta cambiar el ID, el programa da error.
      productUpdated.id
        ? console.log("Error: No puedes actualizar el ID del producto.")
        : Object.assign(products[productFound], productUpdated);

      fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
    }
  }

  deleteProduct(id) {
    let products = this.getProducts();
    let productFound = products.findIndex((product) => product.id === id);

    if (productFound === -1) {
      console.log(
        "Error: No se puede eliminar el producto, no se ha encontrado el ID: " +
          id
      );
    } else {
      products.splice(productFound, productFound + 1);
      fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
    }
  }
}

///////////////////// TESTING ////////////////////////

// let pm = new ProductManager("./products.json");

// console.log(pm.getProducts());

// pm.addProduct(
//   "producto prueba",
//   "Este es un producto prueba",
//   200,
//   "Sin imagen",
//   "abc123",
//   25
// );

// console.log(pm.getProducts());

// pm.getProductById(1);

// // El metodo recibe un ID como primer parametro y el objeto actualizado como segundo parametro
// pm.updateProduct(1, {
//   title: "prueba updated",
//   description: "description updated",
//   stock: 15,
// });

// pm.deleteProduct(1);
