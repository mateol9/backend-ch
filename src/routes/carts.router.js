const Router = require("express").Router;
const CartsManager = require("../managers/CartsManager");

const router = Router();
const cm = new CartsManager("./src/files/carts.json");

router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  cm.addCart(res);
});

router.get("/:cid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  cm.getCartById(+req.params.cid, res);
});

router.post("/:cid/product/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  cm.addProducts(+req.params.cid, +req.params.pid, res);
});

router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = router;
