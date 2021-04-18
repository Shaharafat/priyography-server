/*
 *
 * Title: reviews controller
 * Description: all review control functions
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */

import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { Review } from '../models/review.js';
import ErrorResponse from '../utils/errorResponse.js';

// ✔️ get all reviews
export const getAllReviews = async (req, res, next) => {
  progressMessage('Getting all reviews.');

  try {
    // get all and sort in descending order
    const reviews = await Review.find().sort('-createdAt');

    successMessage('Fetched all reviews');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    errorMessage('Review fetching failed');
    next(new ErrorResponse(500, 'Review fetching failed.'));
  }
};

// ✔️ create a review
export const createReview = async (req, res, next) => {
  progressMessage('User requested to add a review.');

  const { userName, reviewText, stars } = req.body;
  let review = new Review({
    userName,
    reviewText,
    stars
  });

  try {
    review = await review.save();
    successMessage('Review adding success.');
    res.status(200).json({ success: true, message: 'Review added.', review });
  } catch (error) {
    errorMessage('Review adding failed');
    next(new ErrorResponse(500, 'Review adding failed.'));
  }
};
