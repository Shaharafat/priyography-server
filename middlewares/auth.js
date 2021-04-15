/*
 *
 * Title: check auth
 * Description: check user is authenticated or not
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
// dependencies
import jwt from 'jsonwebtoken';
import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { User } from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';

// middleware
export const isAuthenticated = async (req, res, next) => {
  progressMessage('Checking user is authenticated or not.');

  let token;
  console.log(req.headers);
  if (req.headers?.x_auth_token?.startsWith('bearer')) {
    token = req.headers.x_auth_token.split(' ')[1];
    progressMessage('jwt token found.');
  } else {
    errorMessage('No jwt token found.');
    return next(new ErrorResponse(401, 'Unauthorized!'));
  }

  try {
    progressMessage('verifying jwt token.');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find user
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      errorMessage('No user found with this id.');
      return next(new ErrorResponse(401, 'No user found when authorizing'));
    }

    // add user's full name to request body
    req.body.userName = `${user.firstName} ${user.lastName}`;
    // new request property
    req.user = user;

    successMessage('user authenticated.');
    next();
  } catch (error) {
    errorMessage('Inalid token.');
    return next(new ErrorResponse(401, 'Unauthorized!'));
  }
};
