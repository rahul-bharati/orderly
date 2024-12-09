import {Request, Response, NextFunction} from 'express';
import {ZodTypeAny, z} from 'zod';
import {STATUS_CODE} from "../constants/status_codes";

const schemaValidation = (schema: ZodTypeAny, source: 'body' | 'params' | 'query') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(STATUS_CODE.BAD_REQUEST).send({message: `Invalid ${source} data`, errors: error.errors});
      } else {
        next(error);
      }
    }
  }
}

const validateBody = (schema: ZodTypeAny) => schemaValidation(schema, 'body');

const validateParams = (schema: ZodTypeAny) => schemaValidation(schema, 'params');

const validateQuery = (schema: ZodTypeAny) => schemaValidation(schema, 'query');

export {validateBody, validateParams, validateQuery};