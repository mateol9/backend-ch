import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

export const initializePassport = () => {
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

          let user = await usersModel.create({
            name,
            lastName,
            email: username,
            age,
            password: createHash(password),
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

          if (!user) return done(null, false);

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
            let newUser = {
              name,
              email,
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
