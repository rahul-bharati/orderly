import {errorMessageKeys} from "../types/error-message-keys";

export const ERROR_MESSAGES: Record<errorMessageKeys, string> = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  WEAK_PASSWORD: 'Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character',
  INVALID_EMAIL: 'Invalid email',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  PASSWORD_MISMATCH: 'Password and confirm password must match',
  FIRST_NAME_REQUIRED: 'First name is required',
  FIRST_NAME_MIN_LENGTH: 'First name must be at least 3 characters',
  FIRST_NAME_MAX_LENGTH: 'First name must not exceed 255 characters',
  FIRST_NAME_INVALID: 'First name is invalid',
  INTERNAL_SERVER_ERROR: 'Internal server error',
}