import * as mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

export const connect = async () => {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
}

export const closeDatabase = async () => {
    await mongoose.connection?.dropDatabase();
    await mongoose.connection?.close();
}

export const clearDatabase = async () => {
    const collections = mongoose.connection?.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}