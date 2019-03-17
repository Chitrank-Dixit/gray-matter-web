var Express = require('express');
var passport = require('passport');
var router = Express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/questions', require('./questions.routes'));
router.use('/user', passport.authenticate('jwt', {session: false}), require('./users.routes'));

router.use(function(err, req, res, next){
    if(err.name === 'ValidationError'){
      return res.status(422).json({
        errors: Object.keys(err.errors).reduce(function(errors, key){
          errors[key] = err.errors[key].message;
  
          return errors;
        }, {})
      });
    }
  
    return next(err);
  });

module.exports = router;
