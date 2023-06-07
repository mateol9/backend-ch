import { Router } from "express";
import ProductManager from "../dao/ProductManagerDB.js";
import CartsManager from "../dao/CartsManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";
import { passportCall } from "../utils/utils.js";

const router = Router();
const pm = new ProductManager();
const cm = new CartsManager();

router.get("/products", passportCall("jwt"), async (req, res) => {
  let products = await pm.getProducts(
    +req.query.limit,
    +req.query.page,
    req.query.query,
    req.query.sort
  );
  let user = req.user;
  res.render("products", { products, user });
});

router.get("/realtimeproducts", passportCall("jwt"), (req, res) => {
  res.render("realTimeProducts");
});

router.get("/carts/:cid", passportCall("jwt"), async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let cart = await cm.getCartById(req.params.cid, res);
  res.render("cart", { cart });
});

router.get("/chat", passportCall("jwt"), async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages });
});

router.get("/register", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("register");
});

router.get("/login", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login");
});

export default router;
