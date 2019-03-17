var Express = require('express');
var router = Express.Router();

router.use('/api', require('./api'));

module.exports = router;