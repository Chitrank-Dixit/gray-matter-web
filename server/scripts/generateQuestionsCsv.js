// generate questions csv based on the opendb
// get questions with topic , subtopic and difficulty level
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// const url = 'mongodb://localhost:27017';
const url = 'mongodb://localhost:27017/turtlemint?readPreference=primary';
// const url = 'mongodb://prem.stage.mintpro.in:27017';
const dbName = 'turtlemint';
const commandCase = 2;
// Module crypto already included in NodeJS
const crypto = require('crypto');
const csvtojson = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
//const multer  = require('multer')
const path = require('path');
var fs = require('fs');


const initialQuestionImport = function() {
    var csvFile = path.relative(process.cwd(), "./files/initial_question.csv");
    csvtojson().fromFile(csvFile).then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
        // const dbName = 'test';
        var profileIdList = [];
        for (var obj in jsonArrayObj){
            profileIdList.push(obj["Profile_id"]);
        }
    });
}

module.exports = {
    initialQuestionImport: initialQuestionImport
}