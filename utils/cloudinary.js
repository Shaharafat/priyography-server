/*
 *
 * Title: cloudinary image hosting
 * Description: config for cloudinary image hosting
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
import cloudinaryImported from 'cloudinary';

export const cloudinary = cloudinaryImported.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
