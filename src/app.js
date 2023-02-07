const express = require("express");
const ProductManager = require("./ProductManager");

const pm = new ProductManager("./src/products/products.json");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ingrese /products para ver los productos");
});

app.get("/products", (req, res) => {
  let limit = req.query.limit;
  let products = pm.getProducts();
  if (limit) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get("/products/:pid", (req, res) => {
  let product = pm.getProductById(+req.params.pid);
  if (product) {
    res.send(product);
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Aplicacion iniciada en http"//localhost:${PORT}`);
});
