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
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let codeRepeat = this.products.find((product) => product.code == code);

    let emptyFields = !(
      title &&
      description &&
      price &&
      thumbnail &&
      code &&
      stock
    );

    if (codeRepeat || emptyFields) {
      console.log("Error al cargar producto, code repetido o campo vacio");
      return;
    }

    let id = this.products.length + 1;
    let newProduct = new Product(
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );

    this.products.push(newProduct);
    console.log(`Producto agregado exitosamente ID:${id}`);
  }

  getProductById(id) {
    let productFounded = this.products.find((product) => product.id === id);

    if (productFounded) {
      let getProductFounded = `
      Title: ${productFounded.title}
      Description: ${productFounded.description}
      Price: ${productFounded.price}
      Thumbnail: ${productFounded.thumbnail}
      Code: ${productFounded.code}
      Stock: ${productFounded.stock}
      `;
      console.log(
        `El producto que corresponde con el ID ${productFounded.id} es: ${getProductFounded}`
      );
    } else {
      console.log(
        "Error, no se ha encontrado ningun producto que coincida con ese ID"
      );
    }
  }

  getProducts() {
    console.log(this.products);
    return this.products;
  }
}

/////////////////////// TESTING ////////////////////////

// let pm = new ProductManager();
// pm.getProducts();
// pm.addProduct(
//   "producto prueba",
//   "este es un producto prueba",
//   200,
//   "sin imagen",
//   "abc123",
//   25
// );
// pm.getProducts();
// pm.addProduct(
//   "producto prueba",
//   "este es un producto prueba",
//   200,
//   "sin imagen",
//   "abc123",
//   25
// );
// pm.getProductById(1);
