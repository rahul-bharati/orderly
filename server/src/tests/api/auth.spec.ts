import {jwtVerify} from "jose";

import {STATUS_CODE} from "../../constants/status_codes";
import {ERROR_MESSAGES} from "../../constants/error-message";
import {appRequest} from "../test-setup";
import {MESSAGES} from "../../constants/messages";
import {describe} from "@jest/globals";
import {
  invalidLoginPayload,
  invalidRegisterPayload,
  validLoginPayload,
  validRegisterPayload
} from "../testVectors/payloads";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
const JOSE_SECRET = new TextEncoder().encode(JWT_SECRET);

describe("POST /auth/register", () => {
  it("should return 400 on no input", async () => {
    const response = await appRequest.post("/auth/register").send({});
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'firstName',
        message: ERROR_MESSAGES.FIRST_NAME_REQUIRED,
      }),
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.EMAIL_REQUIRED,
      }),
      expect.objectContaining({
        field: 'password',
        message: ERROR_MESSAGES.PASSWORD_REQUIRED
      }),
      expect.objectContaining({
        field: 'confirmPassword',
        message: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED
      })
    ]))
  });

  it("should return 400 on invalid inputs", async () => {
    const response = await appRequest.post("/auth/register").send(invalidRegisterPayload);
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);

    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_EMAIL
      }),
      expect.objectContaining({
        field: 'password',
        message: ERROR_MESSAGES.WEAK_PASSWORD
      }),
      expect.objectContaining({
        field: 'confirmPassword',
        message: ERROR_MESSAGES.PASSWORD_MISMATCH
      })
    ]))
  });


  it("should return 201 Created", async () => {

    const response = await appRequest.post("/auth/register").send(validRegisterPayload);

    expect(response.status).toBe(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(MESSAGES.REGISTER_SUCCESS);
  });

  it("should return 409 on duplicate email", async () => {

    await appRequest.post("/auth/register").send(validRegisterPayload);

    const response = await appRequest.post("/auth/register").send(validRegisterPayload);

    expect(response.status).toBe(STATUS_CODE.CONFLICT);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
      })
    ]))
  });
});

describe("POST /auth/login", () => {

  it('should return 400 on no input', async () => {
    const response = await appRequest.post('/auth/login').send({});
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.EMAIL_REQUIRED
      }),
      expect.objectContaining({
        field: 'password',
        message: ERROR_MESSAGES.PASSWORD_REQUIRED
      })
    ]));
  });

  it("should return 401 on invalid credentials", async () => {
    await appRequest.post("/auth/register").send(invalidRegisterPayload);

    const response = await appRequest.post("/auth/login").send(invalidLoginPayload);

    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      }),
    ]));
  });

  it("should return 200 OK", async () => {
    await appRequest.post("/auth/register").send(validRegisterPayload);

    const response = await appRequest.post("/auth/login").send(validLoginPayload);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    const {accessToken} = response.body.data;

    const accessPayload = await jwtVerify(accessToken, JOSE_SECRET);
    expect(accessPayload).toHaveProperty('payload');
    expect(accessPayload.payload).toHaveProperty('userId');
  });
});


describe("POST /auth/refresh-token", () => {
  it("should return 401 on invalid refresh token", async () => {
    const response = await appRequest.post("/auth/refresh-token").send({
      refreshToken: "invalid-token"
    });

    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'refreshToken',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]));
  });

  it("should return 200 OK", async () => {

    await appRequest.post("/auth/register").send(validRegisterPayload);

    const loginResponse = await appRequest.post("/auth/login").send(validLoginPayload);
    const {refreshToken} = loginResponse.body.data;

    const response = await appRequest.post("/auth/refresh-token").send({refreshToken});

    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
  })
});