import { Router } from 'express';
import * as UserController from '../../controllers/user.controller';
const router = new Router();

// Get all Posts
router.route('/users').get(UserController.getPosts);

// Get one post by cuid
router.route('/users/:cuid').get(UserController.getPost);

// Add a new Post
router.route('/users').post(UserController.addPost);

// Delete a post by cuid
router.route('/users/:cuid').delete(UserController.deletePost);

// update user data using put or patch

export default router;