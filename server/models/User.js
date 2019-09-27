var mongoose = require('mongoose');
var crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: 'String', required: true },
    password: { type: 'String', required: true },
    username: { type: 'String', required: true },
    age: {type: 'Number', required: true},
    salt: {type: 'String'}
    // add interests
    // add badgets
    // add levels
    // add related tournaments
    // add aspirations and career path (what does user want to become)
}, {timestamps: true});

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

userSchema.methods.setPassword = function(password) {
    console.log(password);
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

module.exports = mongoose.model('User', userSchema, 'User');