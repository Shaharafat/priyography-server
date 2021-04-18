/*
 *
 * Title: services controller
 * Description: all routes callback functions to control services
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */

import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { Order } from '../models/order.js';
import { Service } from '../models/service.js';
import { cloudinary } from '../utils/cloudinary.js';
import ErrorResponse from '../utils/errorResponse.js';

// ✔️ get all services
export const getAllServices = async (req, res, next) => {
  progressMessage('request to get all service.');

  try {
    // get and sort services
    const services = await Service.find().sort('-createdAt');

    successMessage('Fetched all services');
    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    errorMessage('Fetching services failed');
    next(new ErrorResponse(500, 'Couldn"t fetch services'));
  }
};
// ✔️ get single service
export const getSingleService = async (req, res, next) => {
  progressMessage('Requesting to get single service.');
  const { serviceId } = req.params;

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (!service) {
      errorMessage('No service found with thid id.');
      return next(new ErrorResponse(404, 'No service found with thid id'));
    }

    successMessage('Service found.');
    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// ✔️ create new services
export const createService = async (req, res, next) => {
  progressMessage('Requesting to create new service.');

  const { name, serviceDetails, price, imageUrl } = req.body;
  let service = new Service({
    name,
    serviceDetails,
    price,
    imageUrl
  });

  try {
    service = await service.save();
    successMessage('Service added.');
    res.status(200).json({ success: true, message: 'Service added', service });
  } catch (error) {
    errorMessage('Service creation failed.');
    next(new ErrorResponse(500, 'Couldn"t create service.'));
  }
};

// ✔️ delete a service
export const deleteService = async (req, res, next) => {
  progressMessage('Requesting to delete a service.');

  const { serviceId } = req.params;

  // ! ============= this section is temporary
  try {
    const order = await Order.find({ service: { _id: serviceId } });
    if (order.length) {
      return next(
        new ErrorResponse(
          500,
          'This service has a pending order. For now you can"t delete this. We will resolve this soon. To check delete a service works or not, try removing a service which is not ordered.'
        )
      );
    }
  } catch (error) {
    next(error);
  }
  // ! ============= this section is temporary

  try {
    await Service.findByIdAndRemove(serviceId);

    successMessage('Service deleted.');
    res.status(200).json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    errorMessage('Couldn"t delete the service.');
    next(new ErrorResponse(500, 'Couldn"t delete the service.'));
  }
};

// ✔️ image upload with cloudinary
export const uploadImageToCloudinary = async (req, res, next) => {
  progressMessage('Requested to upload image on cloudinary.');

  const { imageBlob } = req.body;
  try {
    const response = await cloudinary.uploader.upload(imageBlob, {
      upload_preset: 'priyography'
    });
    successMessage('Image upload successfull.');
    res.status(200).json({ success: true, message: 'Image uploaded', response });
  } catch (error) {
    errorMessage('Uploading image failed.');
    next(new ErrorResponse(500, 'Image Upload failed'));
  }
};
