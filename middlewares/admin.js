/*
 *
 * Title: admin middleware
 * Description: check the authenticated user is admin or not
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */

import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import ErrorResponse from '../utils/errorResponse.js';

export const isAdmin = (req, res, next) => {
  progressMessage('checking user is admin or not.');

  if (req.user?.role === 'admin') {
    successMessage('Admin authorized.');
    next();
  } else {
    errorMessage('User is not an admin.');
    return next(new ErrorResponse(401, 'User is not an admin.'));
  }
};
