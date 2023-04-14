import { Router } from "express";
import ProductManager from "../dao/ProductManagerDB.js";

const router = Router();
const pm = new ProductManager();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let products = await pm.getProducts(
    +req.query.limit,
    +req.query.page,
    req.query.category,
    req.query.status,
    req.query.sort
  );
  res.status(200).json(products);
});

router.get("/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await pm.getProductById(req.params.pid, res);
});

router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.addProduct(req.body, res);
});

router.put("/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.updateProduct(req.params.pid, req.body, res);
});

router.delete("/:pid", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  pm.deleteProduct(req.params.pid, res);
});

router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

export default router;
