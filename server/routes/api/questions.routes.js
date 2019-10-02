var Router =  require('express');
var path = require('path');
var multer = require('multer');
var upload = multer({dest: path.relative(process.cwd(), "./uploads")})
//mport * as UserController from '../../controllers/user.controller';
var importQuestionData = require('../../scripts/importQuestionData');
const router = new Router();

router.get('/health-check', (req, res) => {
    res.send('ok bro');
});

router.get('/import-questions', (req, res) => {
    importQuestionData.getQuestions(req.query.category, req.query.difficulty, req.query.amount).then((data) => {
        if (data) {
            //res.json({"message": "questions collected", "data": data})
            //res.set('Content-Type', 'application/octet-stream');
            res.attachment('filename.csv');
            return res.status(200).send(data);
            
        }
        
    }).catch((err)=> {
        
    })
    //return res.status(200).send(importQuestionData.getQuestions(19, "easy", 10));
});

router.get('/import-questions-to-db', upload.single('questionsImportFile'),(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    importQuestionData.populateQuestionToDb(req.file).then((response) => {
        return res.json({'data': 'done question import'})
    })
});


module.exports = router;