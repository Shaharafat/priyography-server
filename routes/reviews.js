/*
 *
 * Title: review route
 * Description: add and get review route
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import express from 'express';
import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import validate from '../middlewares/validate.js';
import { Review, validateReview } from '../models/review.js';
import ErrorResponse from '../utils/errorResponse.js';

const router = express.Router();

// get all reviews
router.get('/', async (req, res, next) => {
  progressMessage('Getting all reviews.');

  try {
    // get all and sort in descending order
    const reviews = await Review.find().sort('-createdAt');

    successMessage('Fetched all reviews');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    errorMessage('Review fetching failed');
    next(new ErrorResponse(500, 'Review fetching failed.'));
  }
});

// validate and add new review
router.post('/add', validate(validateReview), async (req, res, next) => {
  progressMessage('User requested to add a review.');

  // TODO => get username from req.body
  const { userName, reviewText, stars } = req.body;
  let review = new Review({
    userName,
    reviewText,
    stars,
  });

  try {
    review = await review.save();
    successMessage('Review adding success.');
    res.status(200).json({ success: true, message: 'Review added.', data: review });
  } catch (error) {
    errorMessage('Review adding failed');
    next(new ErrorResponse(500, 'Review adding failed.'));
  }
});

// export route
export default router;
