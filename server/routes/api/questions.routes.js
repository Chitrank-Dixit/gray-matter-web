var Router =  require('express');
//mport * as UserController from '../../controllers/user.controller';
var importQuestionData = require('../../scripts/importQuestionData');
const router = new Router();

router.get('/health-check', (req, res) => {
    res.send('ok');
});

router.get('/import-questions', (req, res) => {
    importQuestionData.getQuestions(19, "easy", 50).then((bool) => {
        if (bool) {
            res.json({"message": "questions collected"})
        }
        
    }).catch((err)=> {
        
    })
});

module.exports = router;