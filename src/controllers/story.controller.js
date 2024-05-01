import { getStories, getUserStory, likeStory, bookMarkStory } from '../services/story.service.js';

export const getStoriesByCategory = async (req, res, next) => {
	try {
		const { category,page } = req.query;
		const stories = await getStories({ category,page });
		res.status(201).json({
			success: 'Stories fetched successfully.',
			data: stories,
		});
	} catch (error) {
		next(error);
	}
};

//pending
export const getStoryById = async (req, res, next) => {
	try {
		
		const { id:storyId } = req.params;
		const story = await getUserStory({ storyId });
		res.status(201).json({
			success: 'Story with given Id fetched successfully.',
			data: story,
		});
	} catch (error) {
		next(error);
	}
};

export const likeStoryById = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const { id: storyId } = req.params;
		const {story,message} = await likeStory({ userId, storyId });
		res.status(201).json({
			success: message,
			data: story,
		});
	} catch (error) {
		next(error);
	}
};

export const bookMarkStoryById = async (req, res, next) => {
	try {
		const { user } = req;
		const { userId } = user;
		const { id:storyId } = req.params;
		const {story,message} = await bookMarkStory({ userId, storyId });
		res.status(201).json({
			success: message,
			data: story,
		});
	} catch (error) {
		next(error);
	}
};
