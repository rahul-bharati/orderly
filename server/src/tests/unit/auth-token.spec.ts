import {afterEach, beforeEach, describe, expect} from "@jest/globals";
import AuthToken from "../../helpers/auth-token";
import {ERROR_MESSAGES} from "../../constants/error-message";

describe('AuthToken', () => {
  const mockEnv = process.env;

  beforeEach(() => {
    process.env = {...mockEnv};
    process.env.ACCESS_TOKEN_SECRET = 'access-token-secret';
    process.env.REFRESH_TOKEN_SECRET = 'refresh-token-secret';
  })

  afterEach(() => {
    process.env = mockEnv;
  })

  it('should generate a valid access token', async () => {
    const payload = {id: 1};

    const accessToken = await AuthToken.generateAccessToken(payload);
    expect(typeof accessToken).toBe('string');
    expect(accessToken.split('.').length).toBe(3);
  })

  it('should generate a valid refresh token', async () => {
    const payload = {id: 1};

    const refreshToken = await AuthToken.generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.split('.').length).toBe(3);
  })

  it("should generate tokens with distinct secrets", async () => {
    const payload = {id: 1};

    const accessToken = await AuthToken.generateAccessToken(payload);
    const refreshToken = await AuthToken.generateRefreshToken(payload);

    expect(accessToken.split('.')[2]).not.toBe(refreshToken.split('.')[2]);
  })
})