import {TokenPayload} from "../common";

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}