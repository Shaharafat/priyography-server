/*
 *
 * Title: review model
 * Description: review schema model and validation
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import Joi from 'joi';
import mongoose from 'mongoose';

// schema
const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    reviewText: { type: String, maxlength: 120, required: true },
    stars: { type: Number, required: true },
  },
  { timestamps: true }
);

// validate
export const validateReview = (review) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    reviewText: Joi.string().max(120).required(),
    stars: Joi.number().min(1).max(5).required(),
  });

  const { error } = schema.validate(review);
  return error;
};

// model
export const Review = mongoose.model('Review', reviewSchema);
