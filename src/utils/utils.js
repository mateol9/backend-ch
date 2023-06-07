import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const PRIVATE_KEY = "mySecretKey";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

export const authToken = (req, res, next) => {
  let token = req.cookies.idToken;
  if (!token) return res.status(401).send({ error: "Not authenticated" });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authorized" });
    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        if (!info) {
          return res.status(401).send("Not authenticated");
        } else {
          return res
            .status(401)
            .send({ error: info.messages ? info.messages : info.toString() });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
