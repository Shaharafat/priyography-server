/*
 *
 * Title: error response
 * Description: extend error object
 * Author: Shah Arafat
 * Date: 08-04-2021
 *
 */
class ErrorResponse extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
