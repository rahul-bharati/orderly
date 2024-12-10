import {ZodIssue} from 'zod';

export const transformZodErrors = (errors: ZodIssue[]) => errors.map(error => ({
  message: error.message,
  field: error.path.join('.')
}))