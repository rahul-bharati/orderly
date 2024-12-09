import {TestApp} from "./test-app";
import request from "supertest";
import {afterEach, beforeAll, afterAll} from "@jest/globals";

let testApp: TestApp = new TestApp();

beforeAll(async () => {
  await testApp.initializeTestDB();
});

afterEach(async () => {
  await testApp.clearTestDB();
});

afterAll(async () => {
  await testApp.closeTestDB();
});

export const appRequest = request(testApp.app);