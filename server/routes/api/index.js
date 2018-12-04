import Express from 'express';
import passport from 'passport';
var router = Express.Router();

router.use('/api/v1', require('./auth.routes.js'));
router.use('/api/v1', passport.authenticate('jwt', {session: false}), require('./users.routes.js'));

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

export default router;
