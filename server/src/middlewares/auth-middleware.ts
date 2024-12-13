import {NextFunction, Request, Response} from 'express';
import {STATUS_CODE} from "../constants/status_codes";
import {ERROR_MESSAGES} from "../constants/error-message";
import authToken from '../helpers/auth-token';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(STATUS_CODE.UNAUTHORIZED).send({
      errors: [{
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      }]
    });

    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = await authToken.verifyAccessToken(token);
    next();
  } catch (error: any) {
    res.status(STATUS_CODE.UNAUTHORIZED).send({
      errors: [{
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      }]
    });
  }
}