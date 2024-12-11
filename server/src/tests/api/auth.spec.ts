import {jwtVerify} from "jose";

import {STATUS_CODE} from "../../constants/status_codes";
import {ERROR_MESSAGES} from "../../constants/error-message";
import {appRequest} from "../test-setup";
import {MESSAGES} from "../../constants/messages";

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
    const response = await appRequest.post("/auth/register").send({
      firstName: "John",
      email: "invalid-email",
      password: "password",
      confirmPassword: 'password1'
    });
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
    const payLoad = {
      firstName: "John",
      email: "testemail@test.com",
      password: "Password123!",
      confirmPassword: 'Password123!'
    }

    const response = await appRequest.post("/auth/register").send(payLoad);

    expect(response.status).toBe(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(MESSAGES.REGISTER_SUCCESS);
  });

  it("should return 409 on duplicate email", async () => {
    const payLoad = {
      firstName: "John",
      email: "testemail@test.com",
      password: "Password123!",
      confirmPassword: 'Password123!'
    }

    await appRequest.post("/auth/register").send(payLoad);

    const response = await appRequest.post("/auth/register").send(payLoad);

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
    const registerPayload = {
      firstName: "John",
      email: "testemail@test.com",
      password: "Password123!",
      confirm_password: 'Password123!',
    }

    await appRequest.post("/auth/register").send(registerPayload);

    const loginPayload = {
      email: "testemail@test.com",
      password: "obviously-wrong-password"
    }

    const response = await appRequest.post("/auth/login").send(loginPayload);

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
    const registerPayload = {
      firstName: "John",
      email: "testemail@test.com",
      password: "Password123!",
      confirmPassword: 'Password123!',
    }

    await appRequest.post("/auth/register").send(registerPayload);

    const loginPayload = {
      email: "testemail@test.com",
      password: "Password123!"
    }

    const response = await appRequest.post("/auth/login").send(loginPayload);
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