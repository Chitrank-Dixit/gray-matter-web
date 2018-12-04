import Express from 'express';
var router = Express.Router();

router.use('/api', require('./api'));

export default router;