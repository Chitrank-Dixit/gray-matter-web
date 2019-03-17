var Router =  require('express');
//mport * as UserController from '../../controllers/user.controller';
const router = new Router();

router.get('/health-check', (req, res) => {
    res.send('ok');
});

module.exports = router;