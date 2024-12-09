import {Request, Response, NextFunction} from "express";

import expressCatchAll from "../../helpers/express-catch-all";
import {ERROR_MESSAGES} from "../../constants/error-message";
import {STATUS_CODE} from "../../constants/status_codes";

describe('Express Catch All Middleware', () => {
  it("should call the handler and return response on success", async () => {
    const mockHandler = jest.fn();
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    await expressCatchAll(mockHandler)(mockRequest, mockResponse, mockNext);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  })

  it("should call the handler and return error response on failure", async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error('Test Error!'));
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    await expressCatchAll(mockHandler)(mockRequest, mockResponse, mockNext);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      error: expect.any(String)
    });
    expect(mockNext).not.toHaveBeenCalled();
  })
});