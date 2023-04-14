import { Router } from "express";
import CartsManager from "../dao/CartsManagerDB.js";

const router = Router();
const cm = new CartsManager();

router.post("/", (req, res) => {
  // CREATE NEW CART
  res.setHeader("Content-Type", "application/json");
  cm.addCart(res);
});

router.get("/", async (req, res) => {
  // GET CARTS
  res.setHeader("Content-Type", "application/json");
  let carts = await cm.getCarts();
  res.status(200).json(carts);
});

router.get("/:cid", async (req, res) => {
  // GET CART BY ID
  res.setHeader("Content-Type", "application/json");
  let cart = await cm.getCartById(req.params.cid, res);
  res.status(200).json(cart);
});

router.post("/:cid/products/:pid", (req, res) => {
  // ADD PRODUCT TO CART
  res.setHeader("Content-Type", "application/json");
  cm.addProduct(req.params.cid, req.params.pid, res);
});

router.put("/:cid/products/:pid", (req, res) => {
  // UPDATE QUANTITY
  res.setHeader("Content-Type", "application/json");
  cm.updateQuantity(req.params.cid, req.params.pid, req.body.quantity, res);
});

router.delete("/:cid/products/:pid", (req, res) => {
  // DELETE PRODUCT
  res.setHeader("Content-Type", "application/json");
  cm.deleteProduct(req.params.cid, req.params.pid, res);
});

router.delete("/:cid", (req, res) => {
  // CLEAR CART
  res.setHeader("Content-Type", "application/json");
  cm.clearCart(req.params.cid, res);
});

router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

export default router;
