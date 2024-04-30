import createHttpError from 'http-errors';
import { StoryModel } from '../models/index.js';

export const getStories = async ({ category, page = 1, limit = 4 }) => {
	let stories;
	const skip = (page - 1) * limit;

	if (category && category !== 'All') {
		console.log('inside if :', category);
		stories = await StoryModel.find({ category: category });
		const total = await StoryModel.countDocuments({ category: category });
		const remaining = total - (skip + stories.length);
		//just to make the frontend more structured, we pass it as an object with category as key
		return { data: { [category]: stories }, remaining: remaining };
	} else {
		// we basically fetch all the category based stories and pass category wise stories to make it generic
		console.log('inside else:', category);
		stories = await StoryModel.find({}).sort({ createdAt: -1 });
		const total = await StoryModel.countDocuments({});
		const isRemaining = skip + stories.length < total;

		// now to just to transform our stories of all categories  in the desired shape
		const categorizedStories = stories.reduce((acc, story) => {
			if (!acc[story.category]) {
				acc[story.category] = []; // if already an key  for an category not added then add that key with the [] array as value.
			}
			if (acc[story.category].length < limit) {
				acc[story.category].push(story);
			}
			return acc;
		}, {});

		//remaining count for each category

		const remainingCounts = await Promise.all(
			Object.keys(categorizedStories).map(async (category) => {
				const total = await StoryModel.countDocuments({ category: category });
				const remaining = total - categorizedStories[category].length;
				return { category, remaining };
			})
		);

		return {
			data: categorizedStories,
			isRemaining: isRemaining,
			remainingCounts: remainingCounts,
		};
	}
};

export const getUserStory = async ({ storyId }) => {
	if (!storyId) {
		throw createHttpError.BadRequest('please provide storyId.');
	}

	const story = await StoryModel.findById({ _id: storyId });
	if (!story) {
		throw createHttpError.NotFound('story with given id not found.');
	}
	return story;
};

export const likeStory = async ({ userId, storyId }) => {
	if (!userId) {
		throw createHttpError.BadRequest('please provide userId.');
	}
	if (!storyId) {
		throw createHttpError.BadRequest('please provide storyId.');
	}

	const story = await StoryModel.findById({ _id: storyId });
	if (!story) {
		throw createHttpError.NotFound('story with given id not found.');
	}

	if (story.likes.includes(userId)) {
		throw createHttpError.BadRequest('you have already liked this story.');
	}

	story.likeCount += 1;
	story.likes.push(userId);

	await story.save();

	return story;
};

export const bookMarkStory = async ({ userId, storyId }) => {
	if (!userId) {
		throw createHttpError.BadRequest('please provide userId.');
	}
	if (!storyId) {
		throw createHttpError.BadRequest('please provide storyId.');
	}

	const story = await StoryModel.findById({ _id: storyId });
	if (!story) {
		throw createHttpError.NotFound('story with given id not found.');
	}

	if (story.bookmarks.includes(userId)) {
		throw createHttpError.BadRequest('you have already bookmarked this story.');
	}

	story.bookmarks.push(userId);

	await story.save();

	return story;
};
