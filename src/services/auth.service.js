import createHttpError from 'http-errors';
import validator from 'validator';
import { UserModel } from '../models/index.js';
import bcrypt from 'bcrypt';

//env variables
const { DEFAULT_PICTURE } = process.env;

export const createUser = async (userData) => {
	const { name, email, picture, password } = userData;

	//   ----------------------all validations---------------------------
	//check if fields are empty
	if (!name || !email || !password) {
		throw createHttpError.BadRequest('please fill all fields');
	}

	//check name length
	if (!validator.isLength(name, { min: 2, max: 16 })) {
		throw createHttpError.BadRequest(
			'please make sure you name is between 2 and 16 characters...'
		);
	}

	//check if email address is valid
	if (!validator.isEmail(email)) {
		throw createHttpError.BadRequest('Please make sure to provide a valid email address');
	}

	//check if user already exits
	const checkDb = await UserModel.findOne({ email });

	if (checkDb) {
		throw createHttpError.Conflict(
			'please try again with a different email address, this email is already registered'
		);
	}

	//check if username already taken
	const checkUsername = await UserModel.findOne({ name });
	if (checkUsername) {
		throw createHttpError.Conflict(
			'please try again with a different userName, this userName is already taken.'
		);
	}

	//check password length
	if (!validator.isLength(password, { min: 6, max: 128 })) {
		throw createHttpError.BadRequest(
			'please make sure your password is between 6 and 128 characters..'
		);
	}

	//hashing of password ----> to be done in the user model using pre-save middleware of mongoose

	// -------------------adding user to the database--------------------
	const user = await new UserModel({
		name,
		email,
		picture: picture || DEFAULT_PICTURE,
		password,
	}).save();

	return user;
};

export const signUser = async (email, password) => {
	const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
	//check if user/email exists
	if (!user) {
		throw createHttpError.NotFound('Invalid credentials');
	}

	//compare passwords
	let passwordMatches = await bcrypt.compare(password, user.password);

	if (!passwordMatches) throw createHttpError.NotFound('Invalid password');

	return user;
};
