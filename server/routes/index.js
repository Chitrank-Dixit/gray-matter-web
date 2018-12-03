import express from 'express'
var router = express.Router();

router.use('/api/v1', require('./api'));

export default router;
