import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register",
    successRedirect: "/login",
  }),
  (req, res) => {}
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = {
      name: req.user.name,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };

    res.redirect("/products");
  }
);

router.get("/github", passport.authenticate("github", {}), (req, res) => {});

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = {
      name: req.user.name,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };

    res.redirect("/products");
  }
);

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
