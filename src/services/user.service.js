import createHttpError from 'http-errors';
import { StoryModel, UserModel } from '../models/index.js';

export const createStory = async ({ addedBy, category, slides }) => {
	//check if fields are empty
	if (!category || !addedBy || !slides) {
		throw createHttpError.BadRequest('please fill all fields.');
	}
	//check slides length
	if (slides.length < 3 || slides.length > 6) {
		throw createHttpError.BadRequest('please provide min 3 and max 6 slides only.');
	}
	// adding story to the database
	const story = await StoryModel.create({
		addedBy,
		category,
		slides,
	});
	return story;
};

export const getAllStories = async ({ userId, page, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!userId) {
		throw createHttpError.BadRequest('userId not provided properly.');
	}

	const stories = await StoryModel.find({ addedBy: userId })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalCount = await StoryModel.countDocuments({ addedBy: userId });
	const remainingCount = totalCount - skip - stories.length;
	return { data: stories, remainingCount };
};

export const getAllBookMarkStories = async ({ userId, page, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!userId) {
		throw createHttpError.BadRequest('userId not provided properly.');
	}

	const { bookmarks } = await UserModel.findById({ _id: userId }).populate({
		path: 'bookmarks',
		model: 'StoryModel',
		options: { sort: { createdAt: -1 } },
	});
	const totalStories = bookmarks.length;
	const updatedStories = bookmarks.slice(skip, skip + limit);
	const remainingCount = totalStories - skip - updatedStories.length;

	return { data: updatedStories, remainingCount: Math.max(0, remainingCount) };
};

export const getUserStory = async ({ userId, storyId }) => {
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
	return story;
};

export const updateUserStory = async ({ userId, storyId, category, slides }) => {
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
	
	if (String(story.addedBy) !== userId) {
		throw createHttpError.BadRequest('You are not allowed to update this story.');
	}

	const updatedStory = await StoryModel.findByIdAndUpdate(
		storyId,
		{ category, slides },
		{ new: true }
	);
	return updatedStory;
};
