import express from 'express';
import trimRequest from 'trim-request';
import authMiddleware from "../middlewares/authMiddleware.js";
import { addStory,getAllUserStories,getuserStoryById,updateStorybyId,getAllUserBookmarkStories } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/stories").post(trimRequest.all,authMiddleware,addStory);
router.route('/stories').get(trimRequest.all,authMiddleware,getAllUserStories);
router.route('/stories/bookmarks').get(trimRequest.all,authMiddleware,getAllUserBookmarkStories);
router.route('/stories/:id').get(trimRequest.all,authMiddleware,getuserStoryById);
router.route('/stories/:id').put(trimRequest.all,authMiddleware,updateStorybyId);

export default router;
