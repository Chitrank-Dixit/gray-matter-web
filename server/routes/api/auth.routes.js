var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var User = require('../../models/User');
const router  = express.Router();

/* POST login. */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if (err || !user) {
            console.log("something is not right");
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           console.log("User is logged")
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           var data = {"_id": user._id, "email": user.email, "age": user.age };
           const token = jwt.sign(data, 'your_jwt_secret');
           return res.json({token});
        });
    })(req, res, next);
});

router.post('/register', (req, res, next) => {
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.age = req.body.age || 18;
    console.log("user credentials got", user);
    user.save().then(function(){
        return res.json({"message": "user created...."})//res.json({user: user.toAuthJSON()});
    }).catch(next);
})

router.get('/us', function(req, res, next){
    return res.json({"me": "I"});
})

module.exports = router;