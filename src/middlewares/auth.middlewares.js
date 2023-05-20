export const authLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};

export const authProducts = (req, res, next) => {
  if (req.session.user) return res.redirect("/products");
  next();
};
