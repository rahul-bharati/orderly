import { z } from 'zod';
import { ERROR_MESSAGES } from "../constants/error-message";

export const ProjectSchemaZod = z.object({
  name: z.string({
    required_error: ERROR_MESSAGES.PROJECT_NAME_REQUIRED,
  }).refine(value => value.trim().length > 0, {
    message: ERROR_MESSAGES.PROJECT_NAME_REQUIRED,
  })
})
