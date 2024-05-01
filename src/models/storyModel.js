import mongoose from 'mongoose';
import validator from 'validator';

const { ObjectId } = mongoose.Schema.Types;

const slideSchema = mongoose.Schema(
	{
		Heading: {
			type: String,
			required: [true, 'please provide heading,'],
		},
		Description: {
			type: String,
			required: [true, 'please provide description.'],
		},
		ImageURL: {
			type: String,
			required: [true, 'please provide imageURL'],
		},
	},
	{
		collection: 'slides',
		timestamps: true,
	}
);

const storySchema = mongoose.Schema(
	{
		category: {
			type: String,
			enum: ['Food', 'Health', 'Travel', 'Movie', 'Education','Medical','World','India'],
			required: [true, 'Please provide Id of story creator.'],
		},

		bookmarks: {
			type: [ObjectId],
			ref: 'UserModel',
		},

		likes: {
			type: [ObjectId],
			ref: 'UserModel',
		},
		likeCount: {
			type: Number,
			default: 0,
		},
		addedBy: {
			type: ObjectId,
			ref: 'UserModel',
			required: [true, 'provide id of the creator of story.'],
		},
		slides: {
			type: [slideSchema],
			ref: 'SlideModel',
			validate: [slidesLength, 'Please provide min 3 and max 6 slides.'],
		},
	},
	{
		collection: 'stories',
		timestamps: true,
	}
);

function slidesLength(slides) {
	return slides.length >= 3 && slides.length <= 6;
}

const StoryModel = mongoose.models.StoryModel || mongoose.model('StoryModel', storySchema);

export default StoryModel;
