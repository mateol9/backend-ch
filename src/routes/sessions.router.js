import { Router } from "express";
import { generateToken, passportCall } from "../utils/utils.js";

const router = Router();

router.get("/current", passportCall("jwt"), (req, res) => {
  res.send(req.user);
});

router.post("/register", passportCall("register"), (req, res) => {});

router.post("/login", passportCall("login"), async (req, res) => {
  let token = generateToken(req.user);

  res
    .cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
    .redirect("/products");
});

router.get("/github", passportCall("github"), (req, res) => {});

router.get("/githubcallback", passportCall("github"), (req, res) => {
  let token = generateToken(req.user);

  res
    .cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
    .redirect("/products");
});

router.get("/logout", (req, res) => {
  res.clearCookie("idToken").redirect("/login");
});

export default router;
