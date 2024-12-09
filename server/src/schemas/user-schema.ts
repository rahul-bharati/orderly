import {z} from 'zod';
import {ERROR_MESSAGES} from "../constants/error-message";

export const UserLoginSchema = z.object({
  email: z.string({
    required_error: ERROR_MESSAGES.EMAIL_REQUIRED,
    invalid_type_error: ERROR_MESSAGES.INVALID_EMAIL,
  }).email(),
  password: z.string({
    required_error: ERROR_MESSAGES.PASSWORD_REQUIRED,
    invalid_type_error: ERROR_MESSAGES.WEAK_PASSWORD,
  }).min(6).max(255)
})

export const UserRegistrationSchema = UserLoginSchema.extend({
  firstName: z.string({
    required_error: ERROR_MESSAGES.FIRST_NAME_REQUIRED,
    invalid_type_error: ERROR_MESSAGES.FIRST_NAME_INVALID,
  }).min(3).max(255),
  lastName: z.string().max(255).optional(),
  confirmPassword: z.string({
    required_error: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    invalid_type_error: ERROR_MESSAGES.PASSWORD_MISMATCH,
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.PASSWORD_MISMATCH,
  path: ['confirmPassword']
})