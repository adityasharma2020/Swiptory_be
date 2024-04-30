import createHttpError from 'http-errors';
import { StoryModel ,UserModel} from '../models/index.js';

export const getStories = async ({ category, page = 1, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!category) {
		throw createHttpError.BadRequest('provide category name.');
	}

	const stories = await StoryModel.find({ category })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalCount = await StoryModel.countDocuments({ category });
	const remainingCount = totalCount - (page - 1) * limit - stories.length;

	return { data: stories, remainingCount, category };
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

	// update the users bookmarks array also so that we dont have to do nested looping when we want to show all users bookmarks
	const user = await UserModel.findById(userId);
	if (!user.bookmarks.includes(storyId)) {
		user.bookmarks.push(storyId);
		await user.save();
	}

	await story.save();

	return story;
};