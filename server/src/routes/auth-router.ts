import {Router} from "express";

import AuthController from "../controllers/auth-controller";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/register', AuthController.register);
    this.router.post('/login', AuthController.login);
    this.router.post('/forgot-password', AuthController.forgotPassword);
    this.router.post('/reset-password', AuthController.resetPassword);
    this.router.post('/change-password', AuthController.changePassword);
    this.router.post('/verify-email', AuthController.verifyEmail);
  }
}

export default new AuthRouter().router;