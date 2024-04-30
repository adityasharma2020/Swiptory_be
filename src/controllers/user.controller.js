import { createStory, getAllStories, getUserStory,getAllBookMarkStories ,updateUserStory} from '../services/user.service.js';

export const addStory = async (req, res, next) => {
	try {
		const { category, slides } = req.body;
		const { user } = req;
		const addedBy = user.userId;

		const story = await createStory({ addedBy, category, slides });
		res.status(201).json({
			success: 'Story created successfully.',
			data: story,
		});
	} catch (error) {
		next(error);
	}
};

export const getAllUserStories = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const { page } = req.query;
		const stories = await getAllStories({ userId, page });
		res.status(201).json({
			success: 'All user stories fetched successfully.',
			data: stories,
		});
	} catch (error) {
		next(error);
	}
};

export const getuserStoryById = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const { storyId } = req.params;
		const story = await getUserStory({ userId, storyId });
		res.status(201).json({
			success: 'Story with given Id fetched successfully.',
			data: story,
		});
	} catch (error) {
		next(error);
	}
};

export const updateStorybyId = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const {id: storyId } = req.params;
		const { category, slides } = req.body;
		const updatedStory = await updateUserStory({ userId, storyId,slides,category });
		res.status(201).json({
			success: 'Story with given Id updated successfully.',
			data: updatedStory,
		});
	} catch (error) {
		next(error);
	}
};

// getAllUserBookmarkStories
export const getAllUserBookmarkStories = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const { page } = req.query;
		const stories = await getAllBookMarkStories({ userId, page });
		res.status(201).json({
			success: 'All user bookmark stories fetched successfully.',
			data: stories,
		});
	} catch (error) {
		next(error);
	}
};