import { Router } from 'express';
import * as UserController from '../../controllers/user.controller';
const router = new Router();

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

export default router;