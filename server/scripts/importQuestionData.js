// get questions with topic , subtopic and difficulty level

// https://stackoverflow.com/questions/47928874/write-and-read-in-mongo-collection-with-asynchronous-node-js-implementation
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const axios = require("axios");
// const url = 'mongodb://localhost:27017';
const url = process.env.MONGO_URL + '?readPreference=primary';
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

const importQuestionFromOtherResources = function() {
    var question_urls = [
        // "https://opentdb.com/api.php?amount=10&category=19",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=easy&type=multiple",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=easy&type=boolean",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=medium&type=multiple",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=medium&type=boolean",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=hard&type=multiple",
        // "https://opentdb.com/api.php?amount=50&category=19&difficulty=hard&type=boolean",
        "https://opentdb.com/api.php?amount=40&category=19"
    ]
    question_urls.forEach((question) => {
        request(question, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', typeof body); // Print the HTML for the Google homepage.
            body = JSON.parse(body);
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
                    
                    question_arr.push(jsonData);
                    //console.log(arr);
                });
            }
            //console.log(headers);
            const json2csvParser = new Json2csvParser({ top_header });
            const npath = path.relative(process.cwd(), "./server/files/importQuestionsToDb1.csv");
            console.log(npath);
            const json_data = json2csvParser.parse(question_arr);
            console.log(json_data);
            fs.stat(npath, function (err, stat) {
                if (err == null) {
                    console.log('File exists');
            
                    //write the actual data and end with newline
                    //var csv = json2csv(toCsv) + newLine;
            
                    fs.appendFile(npath, json_data, function (err) {
                        if (err) throw err;
                        console.log('The "data to append" was appended to file!');
                    });
                }
                else {
                    //write the headers and newline
                    console.log('New file, just writing headers');
                    //fields= (fields + newLine);
            
                    fs.writeFile(npath, json_data, function (err, stat) {
                        if (err) throw err;
                        console.log('file saved');
                    });
                }
            });

            // fs.writeFile(npath, json_data, 'utf8', function (err) {
            //     if (err) {
            //         console.log('Some error occured - file either not saved or corrupted file saved.', err);
            //     } else{
            //         console.log('It\'s saved!');
            //     }
            // });
            console.log('questions collected:', question_arr); // Print the HTML for the Google homepage.
            return true;

        });
    })
        
}

const importQuestionFromOtherResourcesToJson = function() {
    var question_urls = [
        "https://opentdb.com/api.php?amount=10&category=19",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=easy&type=multiple",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=easy&type=boolean",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=medium&type=multiple",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=medium&type=boolean",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=hard&type=multiple",
        "https://opentdb.com/api.php?amount=50&category=19&difficulty=hard&type=boolean",

    ]
    question_urls.forEach((question) => {
        request('', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', typeof body); // Print the HTML for the Google homepage.
            var body = JSON.parse(body);
            
            const npath = path.relative(process.cwd(), "./server/files/importQuestionsToDb1.csv");
            console.log(npath);
            if (body.length > 0) {
            body.forEach((question) => {
                fs.stat(npath, function (err, stat) {
                    if (err == null) {
                        console.log('File exists');
                
                        //write the actual data and end with newline
                        //var csv = json2csv(toCsv) + newLine;
                
                        fs.appendFile(npath, question, function (err) {
                            if (err) throw err;
                            console.log('The "data to append" was appended to file!');
                        });
                    }
                    else {
                        //write the headers and newline
                        console.log('New file, just writing headers');
                        //fields= (fields + newLine);
                
                        fs.writeFile(npath, question, function (err, stat) {
                            if (err) throw err;
                            console.log('file saved');
                        });
                    }
                });
            })
                
            }
            // fs.writeFile(npath, json_data, 'utf8', function (err) {
            //     if (err) {
            //         console.log('Some error occured - file either not saved or corrupted file saved.', err);
            //     } else{
            //         console.log('It\'s saved!');
            //     }
            // });
            console.log('questions collected:'); // Print the HTML for the Google homepage.
            return true;

        });
    })
        
}

const getQuestions = async (category, difficulty, questions) => {
    var url;
    if(category === "0" && difficulty === "any") {
        url = `https://opentdb.com/api.php?amount=${questions}`;
    } else if(category === "0") {
        url = `https://opentdb.com/api.php?amount=${questions}&difficulty=${difficulty}`;
    } else if(difficulty === "any") {
        url = `https://opentdb.com/api.php?amount=${questions}&category=${category}`;
    } else {
        url = `https://opentdb.com/api.php?amount=${questions}&category=${category}&difficulty=${difficulty}`;
    };

    try {
        var response = await axios.get(url);
        var body = response.data.results;
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
        if (body.length > 0) {
            body.forEach(element => {
                var incorrect_answers = [];
                element["incorrect_answers"].forEach((element) => {
                    incorrect_answers.push(decodeURIComponent(element))
                })
                var jsonData = {
                    "Question": decodeURIComponent(element["question"]), 
                    "Answer": decodeURIComponent(element["correct_answer"]), 
                    "Options": [decodeURIComponent(element["correct_answer"]), incorrect_answers], 
                    "explaination": "", 
                    "level": decodeURIComponent(element["difficulty"]), 
                    "brain part improvement": "", 
                    "subject": decodeURIComponent(element["category"]), 
                    "topic": "", 
                    "subtopic": "", 
                    "tags": [decodeURIComponent(element["category"]), decodeURIComponent(element["type"]) , decodeURIComponent(element["difficulty"])], 
                    "asked in (asked in which examination)": "",
                    "Upvotes": 0,
                    "Category": ""
                };
                
                question_arr.push(jsonData);
            });
        }
        const json2csvParser = new Json2csvParser({ top_header });
        return json2csvParser.parse(question_arr);
        
    } catch (error) {
        throw new Error("Unable to fetch questions", error);
    }

}

const populateQuestionToDb = function(file) {
    var tmp_path = file.path;
    var src = fs.createReadStream(tmp_path);
    csvtojson.fromStream(src).then(function(jsonArrayObj) {
        
    })

}

module.exports = {
    initialQuestionImport: initialQuestionImport,
    questionImport: questionImport,
    importQuestionFromOtherResources: importQuestionFromOtherResources,
    importQuestionFromOtherResourcesToJson: importQuestionFromOtherResourcesToJson,
    getQuestions: getQuestions,
    populateQuestionToDb: populateQuestionToDb
}