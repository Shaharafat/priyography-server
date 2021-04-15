/*
 *
 * Title: services routes
 * Description: services routes to post and get services
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import express from 'express';
import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { isAdmin } from '../middlewares/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { Service, validateService } from '../models/service.js';
import ErrorResponse from '../utils/errorResponse.js';

const router = express.Router();

// get all services
router.get('/', async (req, res, next) => {
  progressMessage('request to get all service.');

  try {
    // get and sort services
    const services = await Service.find().sort('-createdAt');

    successMessage('Fetched all services');
    res.status(200).json({
      success: true,
      message: 'Fetched all services',
      data: services,
    });
  } catch (error) {
    errorMessage('Fetching services failed');
    next(new ErrorResponse(500, 'Couldn"t fetch services'));
  }
});

// add new service
router.post(
  '/addService',
  [isAuthenticated, isAdmin, validate(validateService)],
  async (req, res, next) => {
    progressMessage('Requesting to create new service.');

    const { name, serviceDetails, price, imageUrl } = req.body;
    let service = new Service({
      name,
      serviceDetails,
      price,
      imageUrl,
    });

    try {
      service = await service.save();
      successMessage('Service added.');
      res.status(200).json({ success: true, message: 'Service added', data: service });
    } catch (error) {
      errorMessage('Service creation failed.');
      next(new ErrorResponse(500, 'Couldn"t create service.'));
    }
  }
);

// delete a service
router.delete('/delete/:serviceId', [isAuthenticated, isAdmin], async (req, res, next) => {
  progressMessage('Requesting to delete a service.');

  const { serviceId } = req.params;
  try {
    await Service.findByIdAndRemove(serviceId);

    successMessage('Service deleted.');
    res.status(200).json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    errorMessage('Couldn"t delete the service.');
    next(new ErrorResponse(500, 'Couldn"t delete the service.'));
  }
});

// export
export default router;
