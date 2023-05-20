import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";
import crypto from "crypto";

const router = Router();

router.post("/register", async (req, res) => {
  let { name, lastName, email, age, password } = req.body;
  let role;

  if (!email || !password) return res.sendStatus(400);

  let user = await usersModel.findOne({ email });

  if (user) return res.sendStatus(400);

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    role = "admin";
  } else {
    role = "user";
  }

  usersModel.create({
    name,
    lastName,
    email,
    age,
    password: crypto
      .createHash("sha256", "palabraSecreta")
      .update(password)
      .digest("base64"),
    role,
  });

  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  let user = await usersModel.findOne({
    email: email,
    password: crypto
      .createHash("sha256", "palabraSecreta")
      .update(password)
      .digest("base64"),
  });

  if (!user) return res.sendStatus(400);

  req.session.user = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.redirect("/login");
    }
  });
});

export default router;
