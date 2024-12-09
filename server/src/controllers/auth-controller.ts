import {Request, Response} from 'express';
import User from "../models/user";

class AuthController {
  async register(req: Request, res: Response) {
    const {firstName, lastName, email, password} = req.body;
    const user = new User({firstName, lastName, email, password});
    await user.save()
    res.send({message: 'User registered successfully'});
  }

  async login(req: Request, res: Response) {
    // Login logic
    res.send({message: 'User logged in successfully'});
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