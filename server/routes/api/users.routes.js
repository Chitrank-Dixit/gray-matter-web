var Router = require('express');
//import * as UserController from '../../controllers/user.controller';
var UserController = require('../../controllers/user.controller');
const router =  Router();

// Get all Users
router.route('/list').get(UserController.getUsers);

// Get one user by cuid
router.route('/get/:cuid').get(UserController.getUser);

// Add a new User
router.route('/create').post(UserController.addUser);

// Delete a user by cuid
router.route('/delete/:cuid').delete(UserController.deleteUser);

// update user data using put or patch

// test
router.route('/us').get(UserController.getUsersTest);

module.exports = router;