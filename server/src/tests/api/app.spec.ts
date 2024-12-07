import superTest from 'supertest';

import {connect, clearDatabase, closeDatabase} from "../db-config";

import app from "../../app";
import {STATUS_CODE} from "../../constants/status_codes";
import {afterAll, afterEach, beforeAll, describe} from "@jest/globals";

beforeAll(async () => {
    await connect();
})

afterEach(async () => {
    await clearDatabase();
})

afterAll(async () => {
    await closeDatabase();
})

describe('GET /', () => {
    it('should return 200 OK with message', async () => {
        const response = await superTest(app).get('/');
        expect(response.status).toBe(STATUS_CODE.OK);
        expect(response.body).toEqual({message: 'Hello World!'});
    });
});