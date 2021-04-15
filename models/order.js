/*
 *
 * Title: order model
 * Description: order model, schema and validation
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
// dependencies
import Joi from 'joi';
import mongoose from 'mongoose';

// schema
const orderSchema = new mongoose.Schema(
  {
    eventDate: { type: Date, required: true },
    cardNo: {
      type: Number,
      min: 1000000000000000,
      max: 9999999999999999,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true }
);

// validate
export const validateOrder = (order) => {
  const schema = Joi.object({
    eventDate: Joi.date().required(),
    cardNo: Joi.number().min(1000000000000000).max(9999999999999999).required(),
    service: Joi.objectId().required(),
    user: Joi.objectId().required(),
    userName: Joi.string(),
  });

  const { error } = schema.validate(order);
  return error;
};

// model
export const Order = mongoose.model('Order', orderSchema);
