/*
 *
 * Title: services controller
 * Description: all routes callback functions to control services
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */

import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
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
      services,
    });
  } catch (error) {
    errorMessage('Fetching services failed');
    next(new ErrorResponse(500, 'Couldn"t fetch services'));
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
};

// ✔️ delete a service
export const deleteService = async (req, res, next) => {
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
};

// ✔️ image upload with cloudinary
export const uploadImageToCloudinary = async (req, res, next) => {
  progressMessage('Requested to upload image on cloudinary.');

  const { imageBlob } = req.body;
  try {
    const response = await cloudinary.uploader.upload(imageBlob, {
      upload_preset: 'priyography',
    });
    successMessage('Image upload successfull.');
    res.status(200).json({ success: true, message: 'Image uploaded', response });
  } catch (error) {
    errorMessage('Uploading image failed.');
    next(new ErrorResponse(500, 'Image Upload failed'));
  }
};
