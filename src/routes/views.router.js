const Router = require("express").Router;
const ProductManager = require("../managers/ProductManager");

const router = Router();
const pm = new ProductManager("./src/files/products.json");

router.get("/", (req, res) => {
  let products = pm.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
