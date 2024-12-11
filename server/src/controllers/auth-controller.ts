import {Request, Response} from 'express';
import bcrypt from 'bcrypt';

import User, {IUser} from "../models/user";
import {STATUS_CODE} from "../constants/status_codes";
import {MESSAGES} from "../constants/messages";
import {ERROR_MESSAGES} from "../constants/error-message";
import {SALT_ROUNDS} from "../constants/common";
import {Nullable} from "../types/generics";
import authToken from "../helpers/auth-token";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const {firstName, lastName, email, password} = req.body;

    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      res.status(STATUS_CODE.CONFLICT).send({
        errors: [{
          field: 'email',
          message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        }]
      });

      return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({firstName, lastName, email, password: passwordHash});
    await user.save()
    res.status(STATUS_CODE.CREATED).send({message: MESSAGES.REGISTER_SUCCESS});
  }

  async login(req: Request, res: Response): Promise<void> {
    const {email, password} = req.body;
    const user: Nullable<IUser> = await User.findOne({email: email});

    if (!user) {
      res.status(STATUS_CODE.UNAUTHORIZED).send({
        errors: [{
          field: 'email',
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        }]
      });

      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(STATUS_CODE.UNAUTHORIZED).send({
        errors: [{
          field: 'email',
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        }]
      });

      return;
    }

    const accessToken = await authToken.generateAccessToken({userId: user?._id});
    const refreshToken = await authToken.generateRefreshToken({userId: user?._id});

    res.status(STATUS_CODE.OK).send({
      data: {
        accessToken, refreshToken
      }
    });
  }

  async forgotPassword(req: Request, res: Response) {
    // Forgot password logic
    res.send({message: 'Password reset link sent to your email'});
  }

  async resetPassword(req: Request, res: Response) {
    // Reset password logic
    res.send({message: 'Password reset successfully'});
  }

  async changePassword(req: Request, res: Response) {
    // Change password logic
    res.send({message: 'Password changed successfully'});
  }

  async verifyEmail(req: Request, res: Response) {
    // Verify email logic
    res.send({message: 'Email verified successfully'});
  }
}

export default new AuthController();