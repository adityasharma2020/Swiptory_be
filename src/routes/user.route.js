import express from 'express';
import trimRequest from 'trim-request';
import authMiddleware from "../middlewares/authMiddleware.js";
import { addStory,getAllUserStories,getuserStoryById,updateStorybyId } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/stories").post(trimRequest.all,authMiddleware,addStory);
router.route('/stories').get(trimRequest.all,authMiddleware,getAllUserStories);
router.route('/stories/:id').get(trimRequest.all,authMiddleware,getuserStoryById);
router.route('/stories/:id').put(trimRequest.all,authMiddleware,updateStorybyId);

export default router;
