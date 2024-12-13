import {Request, Response} from "express";
import {authMiddleware} from "../../../middlewares/auth-middleware";
import {beforeEach, describe, expect} from "@jest/globals";
import {STATUS_CODE} from "../../../constants/status_codes";
import {ERROR_MESSAGES} from "../../../constants/error-message";
import authToken from "../../../helpers/auth-token";

jest.mock('jose', () => ({
  jwtVerify: jest.fn()
}));

describe('Auth Middleware', () => {
  const mockRequest = (headers: Record<string, string>) => ({headers}) as Partial<Request> as Request;
  const mockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    res.send = jest.fn();
    return res as Response;
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next on valid token", async () => {
    const req = mockRequest({authorization: "Bearer valid_token"});
    const res = mockResponse();

    jest.spyOn(authToken, 'verifyAccessToken').mockResolvedValue({id: 1});

    await authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  })

  it("should return 401 on invalid token", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
    expect(mockNext).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({errors: [{"field": 'authorization', message: ERROR_MESSAGES.INVALID_TOKEN}]});
  })
})