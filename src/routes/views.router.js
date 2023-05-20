import { Router } from "express";
import ProductManager from "../dao/ProductManagerDB.js";
import CartsManager from "../dao/CartsManagerDB.js";
import { authLogin, authProducts } from "../middlewares/auth.middlewares.js";
import { messagesModel } from "../dao/models/messages.model.js";

const router = Router();
const pm = new ProductManager();
const cm = new CartsManager();

router.get("/products", authLogin, async (req, res) => {
  let products = await pm.getProducts(
    +req.query.limit,
    +req.query.page,
    req.query.query,
    req.query.sort
  );
  let user = req.session.user;
  res.render("products", { products, user });
});

router.get("/realtimeproducts", authLogin, (req, res) => {
  res.render("realTimeProducts");
});

router.get("/carts/:cid", authLogin, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let cart = await cm.getCartById(req.params.cid, res);
  res.render("cart", { cart });
});

router.get("/chat", authLogin, async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages });
});

router.get("/register", authProducts, (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("register");
});

router.get("/login", authProducts, (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login");
});

export default router;
