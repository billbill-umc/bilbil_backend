import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { createPostController, getPostsController, getPostController, updatePostController, deletePostController } from '../feature/post/post.controller.js';

const router = Router();

router.post('/posts', asyncHandler(createPostController));
router.get('/posts', asyncHandler(getPostsController));
router.get('/posts/:id', asyncHandler(getPostController));
router.put('/posts/:id', asyncHandler(updatePostController));
router.delete('/posts/:id', asyncHandler(deletePostController));

export default router;
