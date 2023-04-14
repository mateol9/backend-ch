import { Router } from "express";
import ProductManager from "../dao/ProductManagerDB.js";
import CartsManager from "../dao/CartsManagerDB.js";

const router = Router();
const pm = new ProductManager();
const cm = new CartsManager();

router.get("/products", async (req, res) => {
  let products = await pm.getProducts(
    +req.query.limit,
    +req.query.page,
    req.query.query,
    req.query.sort
  );
  console.log(products);
  res.render("products", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/carts/:cid", async (req, res) => {
  // res.setHeader("Content-Type", "text/html");
  let cart = await cm.getCartById(req.params.cid, res);
  res.render("cart", { cart });
});

export default router;
