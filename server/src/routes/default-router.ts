import {Router, Request, Response} from "express";

import {STATUS_CODE} from "../constants/status_codes";

class DefaultRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get('/', (req: Request, res: Response) => {
      res.status(STATUS_CODE.OK).send({message: 'Hello World!'});
    });

    this.router.all('*', (req: Request, res: Response) => {
      res.status(STATUS_CODE.NOT_FOUND).send({message: 'Resource not found'});
    })
  }
}

const defaultRouter = new DefaultRouter().router;
export default defaultRouter;