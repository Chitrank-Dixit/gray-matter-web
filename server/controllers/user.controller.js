var User = require('../models/User');
var cuid = require('cuid');
var slug = require('limax');
var sanitizeHtml = require('sanitize-html');
var jwtDecode = require('jwt-decode');

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */

const getUsersTest = function(req, res) {
  res.json({ "message": "worked"});
}

const getUsers = function(req, res) {
  User.find().select({'username': '1', 'email': '1', 'age': '1'}).sort('-createdAt').exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ users });
  });
}

/**
 * Save a user
 * @param req
 * @param res
 * @returns void
 */
const addUser = function(req, res) {
  if (!req.body.user.email || !req.body.user.password || !req.body.user.age) {
    res.status(403).end();
  }

  const newUser = new User(req.body.user);

  // Let's sanitize inputs
  newUser.email = sanitizeHtml(newUser.email);
  newUser.password = sanitizeHtml(newUser.password);
  newUser.age = sanitizeHtml(newUser.age);

  newUser.slug = slug(newUser.email.toLowerCase(), { lowercase: true });
  newUser.cuid = cuid();
  newUser.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ post: saved });
  });
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
const getUser = function(req, res) {
  res.json({user: req.user});
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
const deleteUser = function(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }

    user.remove(() => {
      res.status(200).end();
    });
  });
}

module.exports = {
  getUsersTest: getUsersTest,
  getUsers: getUsers,
  addUser: addUser,
  getUser: getUser,
  deleteUser: deleteUser
}