const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Staff = require("../models/account/staff.model");

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy({
                usernameField: "username",
                passwordField: "password",
            },
            (username, password, done) => {
                Staff.findOne({ username: username, status: true, }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    const check = bcrypt.compareSync(password, user.password);
                    // const check = password === user.password;
                    if (!check) {
                        console.log("sai mat khau");
                        return done(null, false);
                    }
                    console.log("dung mat khau");
                    return done(null, user);
                });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
