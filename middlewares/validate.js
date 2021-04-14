/*
 *
 * Title: validate middleware
 * Description: joi data validation middleware
 * Author: Shah Arafat
 * Date: 07-04-2021
 *
 */
import { errorMessage, progressMessage } from '../helpers/debugHelpers.js';

const validate = (validator) => (req, res, next) => {
  const error = validator(req.body);
  if (error) {
    errorMessage('user input data joi validation failed');

    // destructure error message
    const {
      details: [{ message }],
    } = error;
    return res.status(400).json({ success: false, message });
  }
  // goto next middleware
  progressMessage('Joi input data validation success.');
  next();
};

export default validate;
