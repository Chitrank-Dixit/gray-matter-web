import { Router } from 'express';
import * as UserController from '../../controllers/user.controller';
const router = new Router();

// Get all Users
router.route('/users').get(UserController.getUsers);

// Get one user by cuid
router.route('/users/:cuid').get(UserController.getUser);

// Add a new User
router.route('/users').post(UserController.addUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(UserController.deleteUser);

// update user data using put or patch

export default router;