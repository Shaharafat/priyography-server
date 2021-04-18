/*
 *
 * Title: services routes
 * Description: services routes to post and get services
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import express from 'express';
import {
  createService,
  deleteService,
  getAllServices,
  getSingleService,
  uploadImageToCloudinary
} from '../controllers/services.js';
import { isAdmin } from '../middlewares/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { validateService } from '../models/service.js';

const router = express.Router();

// get all services
router.get('/', getAllServices);

// get single service
router.get('/:serviceId', getSingleService);

// add new service
router.post('/addService', [isAuthenticated, isAdmin, validate(validateService)], createService);

// delete a service
router.delete('/delete/:serviceId', [isAuthenticated, isAdmin], deleteService);

// upload an image
router.post('/uploadImage', [isAuthenticated, isAdmin], uploadImageToCloudinary);

// export
export default router;
