import App from "../app";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

export class TestApp extends App {
  private mongoServer: MongoMemoryServer | null = null;

  constructor() {
    super();
  }

  public async initializeTestDB() {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();

    await mongoose.connect(uri);
  }

  public async clearTestDB() {
    const collections = mongoose.connection?.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  public async closeTestDB() {
    if (this.mongoServer) {
      await mongoose.connection?.dropDatabase();
      await mongoose.connection?.close();
      await this.mongoServer.stop();
    }
  }
}