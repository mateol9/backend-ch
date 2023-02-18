const Router = require("express").Router;
const ProductManager = require("../managers/ProductManager");

const router = Router();
const pm = new ProductManager("./src/files/products.json");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (pm.getProducts(+req.query.limit, res)) {
    res.status(400).json({ error: "No hay productos cargados" });
  } else {
    pm.getProducts(+req.query.limit, res);
  }
});

router.get("/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.getProductById(+req.params.pid, res);
});

router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.addProduct(req.body, res);
});

router.put("/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.updateProduct(+req.params.pid, req.body, res);
});

router.delete("/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.deleteProduct(+req.params.pid, res);
});

router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = router;
