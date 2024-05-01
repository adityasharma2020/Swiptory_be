import createHttpError from 'http-errors';
import { StoryModel, UserModel } from '../models/index.js';

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
	const index = story.likes.indexOf(userId);
	let message;
	if (index !== -1) {
		story.likes.splice(index, 1);
		story.likeCount -= 1;
		message = 'story disliked successfully.';
	} else {
		story.likeCount += 1;
		story.likes.push(userId);
		message = 'story liked successfully.';
	}

	await story.save();

	return { story, message };
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
	const index = story.bookmarks.indexOf(userId);
	let message;
	if (index !== -1) {
		story.bookmarks.splice(index, 1);
		message = 'story unbokmarked successfully.';
	} else {
		story.bookmarks.push(userId);
		message = 'story bookmarked successfully.';
	}

	// update the users bookmarks array also so that we dont have to do nested looping when we want to show all users bookmarks
	const user = await UserModel.findById(userId);
	const indexBookmark = user.bookmarks.indexOf(storyId);

	if (indexBookmark !== -1) {
		user.bookmarks.splice(index, 1);
	} else {
		user.bookmarks.push(storyId);
	}
	await user.save();

	await story.save();

	return { story, message };
};
