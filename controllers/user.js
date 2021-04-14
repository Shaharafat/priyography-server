/*
 *
 * Title: user controller functions
 * Description: all user authentication related functions.
 * Author: Shah Arafat
 * Date: 09-04-2021
 *
 */
import crypto from 'crypto';
import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { generatePasswordResetMessage } from '../helpers/emailMessages.js';
import { User } from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendmail.js';

// send auth token
const sendAuthToken = (user, statusCode, res) => {
  const token = user.generateAuthToken(); // generate auth token
  res.status(statusCode).json({ success: true, token });
  successMessage('Logged in successly and Auth token sent.');
};

// ✔️ register user controller
export const register = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  progressMessage('Creating new user.');
  let user = new User({
    firstName,
    lastName,
    username,
    email,
    password,
  });

  try {
    user = await user.save(); // save user

    successMessage('New user added');
    sendAuthToken(user, 200, res);
  } catch (err) {
    errorMessage('New user adding failed');
    next(err);
  }
};

// ✔️ login user controller
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  progressMessage('User requested to login.');
  // if input not provided
  if (!email || !password) {
    return next(new ErrorResponse(400, 'Email and password field is required'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(400, 'Invalid email or password!'));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(400, 'Invalid email or password!'));
  }

  progressMessage('Email and password matched');
  // if everything is ok. then send token.
  sendAuthToken(user, 200, res);
};

// ✔️ forgot password controller
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  progressMessage('User requested to reset password.');
  if (!email) {
    return next(new ErrorResponse(400, 'Put your email first!'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(404, 'No user found with this email'));
  }

  // now trying to send mail
  const resetToken = user.generateResetToken();
  await user.save();

  progressMessage('Sending Email.');
  const { firstName, email: userEmail } = user;
  // get message template
  const message = generatePasswordResetMessage(firstName, resetToken);

  const options = {
    to: userEmail,
    subject: 'Reset noteit passowrd',
    message,
  };

  try {
    // sent email
    await sendEmail(options, res);

    successMessage('Mail sent.');
    res.status(200).json({
      success: true,
      message: 'Password reset mail sent. Reset link will active next 10 minutes',
    });
  } catch (error) {
    // reset this two fields
    user.passwordResetToken = undefined;
    user.passwordResetTimeout = undefined;
    await user.save();

    errorMessage('Mail sending failed.');
    return next(new ErrorResponse(400, 'Password reset mail sending failed.'));
  }
};

// ✔️ reset password controller
export const resetPassword = async (req, res, next) => {
  progressMessage('Password reset with token start');

  const { resetToken } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTimeout: { $gt: Date.now() },
    });

    if (!user) {
      errorMessage('Token varification failed.');
      return next(new ErrorResponse(400, 'Invalid Token.'));
    }
    user.password = password; // update password;
    user.passwordResetToken = undefined;
    user.passwordResetTimeout = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful.',
      token: user.generateAuthToken(),
    });
    successMessage('Password reset successful and auth token sent.');
  } catch (error) {
    next(error);
  }
};
