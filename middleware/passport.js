const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/users");

// Register Setup
passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userExistsFlag = await UserModel.exists({ email: email });
        if (!userExistsFlag) {
          const user = await UserModel.create({ ...req.body, email, password });
          return done(null, user, {
            message: "Registered Successfully",
            status: 200,
          });
        } else {
          return done(null, false, {
            message: "User with email exists",
            status: 404,
          });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

// Login Setup
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
