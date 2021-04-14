/*
 *
 * Title: database helper functions
 * Description: database helper functions
 * Author: Shah Arafat
 * Date: 07-04-2021
 *
 */
// dependencies
import colors from 'colors';
import debug from 'debug';

// debug database
export const debugDB = debug('app:db');

// debug server
export const debugServer = debug('app:server');

// error
const error = debug('task:error');

// success
const success = debug('task:success');

// processing
const progress = debug('task:progress');

// formatted message
export const errorMessage = (message) => error(colors.red.bold('❌ ', message));

export const successMessage = (message) => success(colors.green.bold('✔️ ', message));

export const progressMessage = (message) => progress(colors.yellow.bold(' 🐾 ', message));
