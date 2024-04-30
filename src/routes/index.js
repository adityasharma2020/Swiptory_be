import express from 'express';
import authRoutes from './auth.route.js';
import storyRoutes from './story.route.js';
import userRoutes from './user.route.js';
const router = express.Router();

// ---------- All Types of Routes -------
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/stories', storyRoutes);

export default router;
