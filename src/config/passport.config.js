import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import jwt from "passport-jwt";
import { usersModel } from "../dao/models/users.model.js";
import { cartsModel } from "../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.idToken;
  }
  return token;
};

export const initializePassport = () => {
  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "mySecretKey",
      },
      (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new local.Strategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          let { name, lastName, age } = req.body;
          let role;

          if (!username || !password) return done(null, false);

          let currentUser = await usersModel.findOne({ email: username });

          if (currentUser) return done(null, false);

          if (
            username === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            role = "admin";
          } else {
            role = "user";
          }

          let cart = await cartsModel.create({ products: [] });

          let user = await usersModel.create({
            name,
            lastName,
            email: username,
            age,
            password: createHash(password),
            cart: cart._id,
            role,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (!username || !password) return done(null, false);

          let user = await usersModel.findOne({ email: username });

          if (!user) return done(null, false, { messages: "No user found" });

          if (!isValidPassword(password, user)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.b37f86f9f80e30ca",
        clientSecret: "897e0ceeceb1a71497828a73cdcc26c8a2d83006",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          console.log(profile._json);
          let name = profile._json.name;
          let email = profile._json.email;

          let user = await usersModel.findOne({ email: email });
          if (!user) {
            let cart = await cartsModel.create({ products: [] });
            let newUser = {
              name,
              email,
              cart: cart._id,
              role: "user",
              github: true,
              githubProfile: profile._json,
            };
            user = await usersModel.create(newUser);
          } else {
            let updatedUser = {
              github: true,
              githubProfile: profile._json,
            };

            await usersModel.updateOne({ email: email }, updatedUser);
          }

          done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersModel.findOne({ _id: id });
    done(null, user);
  });
};
