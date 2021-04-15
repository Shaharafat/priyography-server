/*
 *
 * Title: user model
 * Description: user model to register user
 * Author: Shah Arafat
 * Date: 07-04-2021
 *
 */
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { errorMessage, progressMessage } from '../helpers/debugHelpers.js';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
  role: {
    type: String,
    default: 'customer',
  },
  passwordResetToken: { type: String },
  passwordResetTimeout: { type: Date },
});

// hash password before saving
userSchema.pre('save', async function (next) {
  // if previous saved password is not modified
  // then goto next middleware
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    progressMessage('Password hashing done.');
    next();
  } catch (err) {
    errorMessage('Hashing password failed');
    next(err);
  }
});

// match user password
userSchema.methods.matchPassword = function (password) {
  progressMessage('Matching password.');

  return bcrypt.compare(password, this.password);
};

// generate jwt token
userSchema.methods.generateAuthToken = function () {
  progressMessage('Creating jwt token.');

  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // set token to user
  this.passwordResetToken = hashedToken;
  // set token expire time
  this.passwordResetTimeout = Date.now() + 1000 * 60 * 10;

  progressMessage('Reset token Created.');
  return resetToken;
};

// user model
export const User = mongoose.model('User', userSchema);

// validate user
export const validateUser = (user) => {
  // create schema
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .message('password must contain atleast 1 capital letter, 1 small letter and 1 digit')
      .required(),
  });

  // validate schema
  const { error } = schema.validate(user);
  return error;
};
