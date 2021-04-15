/*
 *
 * Title: review route
 * Description: add and get review route
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import express from 'express';
import { createReview, getAllReviews } from '../controllers/reviews.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { validateReview } from '../models/review.js';

const router = express.Router();

// get all reviews
router.get('/', getAllReviews);

// validate and add new review
router.post('/add', [isAuthenticated, validate(validateReview)], createReview);

// export route
export default router;
