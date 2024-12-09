import {Router} from "express";

import AuthController from "../controllers/auth-controller";
import {validateBody} from "../middlewares/schema-validation";
import {UserLoginSchema, UserRegistrationSchema} from "../schemas/user-schema";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/register', validateBody(UserRegistrationSchema), AuthController.register);
    this.router.post('/login', validateBody(UserLoginSchema), AuthController.login);
    this.router.post('/forgot-password', AuthController.forgotPassword);
    this.router.post('/reset-password', AuthController.resetPassword);
    this.router.post('/change-password', AuthController.changePassword);
    this.router.post('/verify-email', AuthController.verifyEmail);
  }
}

const authRouter = new AuthRouter().router;
export default authRouter;