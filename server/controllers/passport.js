//passport.js
var passport =require('passport');
var passportLocal = require('passport-local');
var passportJWT = require('passport-jwt');
var UserModel = require('../models/User');
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload, cb) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return UserModel.findById(jwtPayload._id).select({"password": 0, "salt": 0})
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return UserModel.findOne({email})
           .then(user => {
               if (!user) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }
               else if (user.validPassword(password))
               {
                    
                    return cb(null, user, {message: 'Logged In Successfully'});
               }
               else {
                    
                    return cb(null, false, {message: 'Error occured while authentication'});
               }
               
               
          })
          .catch(err => cb(err));
    }
));