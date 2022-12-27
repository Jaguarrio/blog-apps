const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_KEY,
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ _id: payload._id, email: payload.email });
        if (!user) return done(null, false);
        
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
