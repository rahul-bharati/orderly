import express, {Application, Router} from 'express';
import cors from 'cors';
import helmet from "helmet";
// @ts-ignore
import morgan from 'morgan';
import mongoose from "mongoose";

import Routers from "./routes/routers";

export class App {
  public app: Application;
  private routers: { path: string, router: Router }[] = Routers;

  constructor() {
    this.app = express();
    this.initializeDefaultMiddlewares();
    this.registerRouter();
  }

  private initializeDefaultMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cors());
    this.app.use(morgan('combined'));
    this.app.use(helmet());
  }

  public registerRouter() {
    this.routers.forEach(({path, router}) => {
      this.app.use(path, router);
    });
  }

  public async initializeMongoDB(uri?: string) {
    if (uri) {
      await mongoose.connect(uri);
    }
    console.info("Database connected successfully");
  }

  public async closeMongoDB() {
    await mongoose.connection.close();
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}

export default App;