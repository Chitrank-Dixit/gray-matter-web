// get questions with topic , subtopic and difficulty level

// https://stackoverflow.com/questions/47928874/write-and-read-in-mongo-collection-with-asynchronous-node-js-implementation
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// const url = 'mongodb://localhost:27017';
const url = 'mongodb://localhost:27017/graymatter?readPreference=primary';
// const url = 'mongodb://prem.stage.mintpro.in:27017';
const dbName = 'graymatter';
const commandCase = 2;
// Module crypto already included in NodeJS
const crypto = require('crypto');
const csvtojson = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
//const multer  = require('multer')
const path = require('path');
const fs = require('fs');
const request = require('request');

var mongodb;
var collectionName = "some-collection";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    mongodb = db;
});

const initialQuestionImport = function() {
    var csvFile = path.relative(process.cwd(), "./server/files/importQuestionsToDb.csv");
    //when parse finished, result will be emitted here.
    csvtojson().fromFile(csvFile).then(function(jsonArrayObj) { 
        // const dbName = 'test';
        const db = mongodb.db(dbName);
        const questions = db.collection('questions');
        questions.insertMany(jsonArrayObj, function(err, doc){
            if (err) throw err;
            else {
                console.log("data inserted");
                mongodb.close();
                return true;
            }
        });
        // jsonArrayObj.forEach(element => {
        //     questions.insertOne(element, function(err, doc){
        //         if (err) { 
        //             console.log(element, err); 
        //             client.close();
        //         }
        //         else {
        //             console.log("inserted...");
        //         }
        //     });
        // });
    });
}

const questionImport = function() {
    var csvFile = path.relative(process.cwd(), "./server/files/importQuestionsToDb.csv");
    //when parse finished, result will be emitted here.
    csvtojson().fromFile(csvFile).then(function(jsonArrayObj) { 
        // const dbName = 'test';
        const db = mongodb.db(dbName);
        const questions = db.collection('questions');
        questions.insertMany(jsonArrayObj, function(err, doc){
            if (err) throw err;
            else {
                console.log("data inserted");
                mongodb.close();
            }
        });
        // jsonArrayObj.forEach(element => {
        //     questions.insertOne(element, function(err, doc){
        //         if (err) { 
        //             console.log(element, err); 
        //             client.close();
        //         }
        //         else {
        //             console.log("inserted...");
        //         }
        //     });
        // });
        //client.close();
    });
}


//initialQuestionImport();
questionImport();

const importQuestionFromOtherResources = function() {
    request('https://opentdb.com/api.php?amount=50', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', typeof body); // Print the HTML for the Google homepage.
        var body = JSON.parse(body);
        var top_header = [
            "Question", 
            "Answer", 
            "Options", 
            "explaination", 
            "level", 
            "brain part improvement", 
            "subject", 
            "topic", 
            "subtopic", 
            "tags asked in (asked in which examination)", 
            "Upvotes"
        ];
        const question_arr = [];
        //console.log(body.results);
        // question_arr.push(top_header);
        if (body["response_code"] === 0) {
            body["results"].forEach(element => {
                var jsonData = {
                    "Question": element["question"], 
                    "Answer": element["correct_answer"], 
                    "Options": [element["correct_answer"] + element["incorrect_answers"]], 
                    "explaination": "", 
                    "level": element["difficulty"], 
                    "brain part improvement": "", 
                    "subject": element["category"], 
                    "topic": "", 
                    "subtopic": "", 
                    "tags": [element["category"] + element["type"] + element["difficulty"]], 
                    "Upvotes": 0
                };
                // // Question
                // arr.push(element["question"]);
                // // Answer
                // arr.push(element["correct_answer"]);
                // // Options
                // arr.push([element["correct_answer"] + element["incorrect_answers"]]);
                // // explaination
                // arr.push("");
                // // level
                // arr.push(element["difficulty"]);
                // // brain part improvement
                // arr.push("");
                // // subject
                // arr.push(element["category"]); 
                // // topic
                // arr.push("");
                // // subtopic
                // arr.push("");
                // // tags
                // arr.push([element["category"] + element["type"] + element["difficulty"]]);
                // // upvotes
                // arr.push(0);
                question_arr.push(jsonData);
                //console.log(arr);
            });
        }
        //console.log(headers);
        const json2csvParser = new Json2csvParser({ top_header });
        const npath = path.relative(process.cwd(), "./server/files/importQuestionsToDb.csv");
        console.log(npath);
        const json_data = json2csvParser.parse(question_arr);
        console.log(json_data);
        fs.writeFile(npath, json_data, 'utf8', function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.', err);
            } else{
                console.log('It\'s saved!');
            }
        });
        console.log('questions collected:', question_arr); // Print the HTML for the Google homepage.
        return true;

    });
}

//importQuestionFromOtherResources();

module.export = {
    initialQuestionImport: initialQuestionImport,
    questionImport: questionImport,
    importQuestionFromOtherResources: importQuestionFromOtherResources
}