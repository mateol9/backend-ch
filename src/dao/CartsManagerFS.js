import fs from "fs";

class Cart {
  constructor(id, products) {
    this.id = id;
    this.products = products;
  }
}

class CartItem {
  constructor(id, quantity) {
    this.id = id;
    this.quantity = quantity;
  }
}

export default class CartsManager {
  constructor(path) {
    this.path = path;
  }

  getCarts() {
    if (fs.existsSync(this.path)) {
      let read = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(read);
    } else {
      return [];
    }
  }

  addCart(res) {
    let carts = this.getCarts();
    let id = carts.length + 1;
    // Evita que se repitan los ID al eliminar un carrito y agregar otro
    while (carts.some((cart) => cart.id === id)) {
      id++;
    }
    let products = [];

    let newCart = new Cart(id, products);

    carts.push(newCart);

    fs.writeFileSync(this.path, JSON.stringify(carts, null, 4));

    res.status(201).json({ message: `Nuevo carrito creado, ID:${id}` });
  }

  getCartById(id, res) {
    let carts = this.getCarts();
    let cartFound = carts.findIndex((cart) => cart.id === id);

    if (cartFound === -1) {
      return res
        .status(400)
        .json({ error: `No existe ningun carrito con el ID: ${id}` });
    } else {
      return res.status(200).json(carts[cartFound]);
    }
  }

  addProducts(cid, pid, res) {
    let carts = this.getCarts();
    let cartFound = carts.findIndex((cart) => cart.id === cid);

    if (cartFound === -1) {
      return res
        .status(400)
        .json({ error: `No se ha encontrado un carrito con el ID:${cid}` });
    }

    let productRepeated = carts[cartFound].products.findIndex(
      (product) => product.id === pid
    );

    if (productRepeated !== -1) {
      carts[cartFound].products[productRepeated].quantity++;
      fs.writeFileSync(this.path, JSON.stringify(carts, null, 4));
      return res.status(200).json({
        message: `El producto de ID: ${pid} ya existe. Se incrementara la cantidad.`,
      });
    }

    let newProduct = new CartItem(pid, 1);
    carts[cartFound].products.push(newProduct);

    fs.writeFileSync(this.path, JSON.stringify(carts, null, 4));
    return res.status(200).json({
      message: `Se ha agregado el producto de ID:${pid} al carrito de ID:${cid}`,
    });
  }
}
