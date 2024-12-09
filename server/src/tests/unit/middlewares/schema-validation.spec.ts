import {Request, Response, NextFunction} from "express";
import {z} from 'zod';

import {STATUS_CODE} from "../../../constants/status_codes";
import {beforeEach, describe, expect} from "@jest/globals";
import {validateBody} from "../../../middlewares/schema-validation";

describe('Schema Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = jest.mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  })

  it('should return 404 if validation fails', async () => {
    const schema = z.object({
      name: z.string(),
    });

    mockRequest.body = {name: 123};

    const middleware = validateBody(schema);
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if validation passes', async () => {
    const schema = z.object({
      name: z.string(),
    });

    mockRequest.body = {name: 'John Doe'};

    const middleware = validateBody(schema);
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});