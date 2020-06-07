const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const user = mongoose.model("users");
const keys = require("../config/keys_dev");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
    console.log(1234);
    console.log(opts);
    console.log(user);
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
            console.log(2);
            user.findById(jwt_payload._id)
            .then(user => {
                console.log(3);
                if (user) return done(null, user);
                else return done(null, false)
            })
            .catch(err => console.log("problem with passport function that return current user"))
    })
    );
    console.log(5);
};
