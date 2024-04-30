import express from 'express';
import trimRequest from 'trim-request';
import {
	getStoriesByCategory,
	getStoryById,
	likeStoryById,
	bookMarkStoryById,
} from '../controllers/story.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').get(trimRequest.all, getStoriesByCategory);
router.route('/:id').get(trimRequest.all, getStoryById);
router.route('/:id/like').put(trimRequest.all, authMiddleware, likeStoryById);
router.route('/:id/bookmark').put(trimRequest.all, authMiddleware, bookMarkStoryById);

export default router;
