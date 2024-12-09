import {jwtVerify} from "jose";

import {STATUS_CODE} from "../../constants/status_codes";
import {ERROR_MESSAGES} from "../../constants/error-message";
import {appRequest} from "../test-setup";

const JWT_SECRET = process.env.JWT_SECRET || '';
const JOSE_SECRET = new TextEncoder().encode(JWT_SECRET);

describe("POST /auth/register", () => {
  it("should return 400 on no input", async () => {
    const response = await appRequest.post("/auth/register").send({});
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.EMAIL_REQUIRED
      }),
      expect.objectContaining({
        field: 'password',
        message: ERROR_MESSAGES.PASSWORD_REQUIRED
      }),
      expect.objectContaining({
        field: 'confirm_password',
        message: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED
      })
    ]))
  });

  it("should return 400 on invalid inputs", async () => {
    const response = await appRequest.post("/auth/register").send({
      email: "invalid-email",
      password: "pass",
      confirm_password: 'password'
    });
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);

    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_EMAIL
      }),
      expect.objectContaining({
        field: 'password',
        message: ERROR_MESSAGES.WEAK_PASSWORD
      }),
      expect.objectContaining({
        field: 'confirm_password',
        message: ERROR_MESSAGES.PASSWORD_MISMATCH
      })
    ]))
  });


  it("should return 201 Created", async () => {
    const payLoad = {
      email: "testemail@test.com",
      password: "Password123!",
      confirm_password: 'Password123!'
    }

    const response = await appRequest.post("/auth/register").send(payLoad);

    expect(response.status).toBe(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('data');

    const {data} = response.body;
    expect(data).toHaveProperty('email');
    expect(data.email).toBe(payLoad.email);
  });

  it("should return 409 on duplicate email", async () => {
    const payLoad = {
      email: "testmail@test.com",
      password: "Password123!",
      confirm_password: 'Password123'
    }

    await appRequest.post("/auth/register").send(payLoad);

    const response = await appRequest.post("/auth/register").send(payLoad);

    expect(response.status).toBe(STATUS_CODE.CONFLICT);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
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

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
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

  it("should return 400 on invalid input", async () => {
    const payLoad = {
      email: "invalid-email",
      password: "pass"
    }

    const response = await appRequest.post("/auth/login").send(payLoad);
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');

    expect(Array.isArray(response.body.errors)).toBe(true);

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_EMAIL
      }),
    ]));
  });

  it("should return 401 on invalid credentials", async () => {
    const registerPayload = {
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

    expect(response.body.errors).toContainEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      }),
    ]));
  });

  it("should return 200 OK", async () => {
    const registerPayload = {
      email: "testemail@test.com",
      password: "Password123!",
      confirm_password: 'Password123!',
    }

    await appRequest.post("/auth/register").send(registerPayload);

    const loginPayload = {
      email: "testemail@test.com",
      password: "Password123!"
    }

    const response = await appRequest.post("/auth/login").send(loginPayload);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('access_token');
    expect(response.body.data).toHaveProperty('refresh_token');
    const {access_token} = response.body.data;

    const accessPayload = await jwtVerify(access_token, JOSE_SECRET);
    expect(accessPayload).toHaveProperty('email', loginPayload.email);
  });
});