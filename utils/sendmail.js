/*
 *
 * Title: send email
 * Description: send email to confirm registration or password reset
 * Author: Shah Arafat
 * Date: 09-04-2021
 *
 */
import sgmail from '@sendgrid/mail';
import dotenv from 'dotenv';

// config dotenv
dotenv.config();

// set sendgrid api key
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

// resuable function to send mail
const sendEmail = ({ to, subject, message }) => {
  const msg = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: message,
  };

  return sgmail.send(msg); // send mail
};

export default sendEmail;
