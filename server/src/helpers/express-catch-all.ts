import {RequestHandler} from "express";
import {STATUS_CODE} from "../constants/status_codes";
import {ERROR_MESSAGES} from "../constants/error-message";

const expressCatchAll = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error: Error | any) {
      console.error('Error in request handler:', error); // Log the error (optional)
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error: process.env.NODE_ENV === "development" ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  };
};

export default expressCatchAll;
