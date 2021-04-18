/*
 *
 * Title: service model
 * Description: service model, schema, validation functions
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
// depencencies
import Joi from 'joi';
import mongoose from 'mongoose';

// schema
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, maxlength: 50, required: true },
    serviceDetails: [{ type: String, required: true }],
    price: { type: Number, min: 5, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

// validate
export const validateService = (service) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    // serviceDetails: Joi.string().required(),
    serviceDetails: Joi.array().items(Joi.string()).min(1).required(),
    price: Joi.number().greater(5).required(),
    imageUrl: Joi.string().required(),
    userName: Joi.string()
  });

  const { error } = schema.validate(service);
  return error;
};

// model
export const Service = mongoose.model('Service', serviceSchema);
