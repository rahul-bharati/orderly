import {jwtVerify, SignJWT, errors as JoseErrors} from "jose";
import {TokenPayload} from "../types/common";
import {ERROR_MESSAGES} from "../constants/error-message";

class AuthToken {
  private static readonly ACCESS_TOKEN_EXPIRATION = "15m";
  private static readonly REFRESH_TOKEN_EXPIRATION = "7d";

  private readonly accessTokenSecret: Uint8Array;
  private readonly refreshTokenSecret: Uint8Array;

  constructor() {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error(ERROR_MESSAGES.AUTH_TOKENS_NOT_SET);
    }

    this.accessTokenSecret = new TextEncoder().encode(accessSecret);
    this.refreshTokenSecret = new TextEncoder().encode(refreshSecret);
  }

  /**
   * Generates a JWT with the given payload, secret, and expiration time.
   * @param payload The payload to include in the token.
   * @param secret The secret key to sign the token.
   * @param expiresIn The expiration time (e.g., "15m", "7d").
   * @returns A signed JWT as a string.
   */
  private async generateToken(payload: TokenPayload, secret: Uint8Array, expiresIn: string): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({alg: "HS256"})
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
  }

  /**
   * Generates an access token.
   * @param payload The payload to include in the token.
   * @returns A signed access token as a string.
   */
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.generateToken(payload, this.accessTokenSecret, AuthToken.ACCESS_TOKEN_EXPIRATION);
  }

  /**
   * Generates a refresh token.
   * @param payload The payload to include in the token.
   * @returns A signed refresh token as a string.
   */
  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return this.generateToken(payload, this.refreshTokenSecret, AuthToken.REFRESH_TOKEN_EXPIRATION);
  }

  /**
   * Verifies a JWT.
   * @param token The JWT to verify.
   * @param secret The secret key to verify the token.
   * @returns The payload of the token if it is valid.
   */
  private async verifyToken(token: string, secret: Uint8Array): Promise<TokenPayload> {
    try {
      return await jwtVerify(token, secret, {algorithms: ["HS256"]});
    } catch (error) {
      if (error instanceof JoseErrors.JWTExpired) {
        throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
      }
      if (error instanceof JoseErrors.JWTClaimValidationFailed) {
        throw new Error(ERROR_MESSAGES.INVALID_TOKEN_CLAIMS);
      }
      if (error instanceof JoseErrors.JOSEAlgNotAllowed) {
        throw new Error(ERROR_MESSAGES.INVALID_TOKEN_ALGORITHM);
      }
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  /**
   * Verifies an access token.
   * @param token The access token to verify.
   * @returns The payload of the token if it is valid.
   */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.verifyToken(token, this.accessTokenSecret);
  }

  /**
   * Verifies a refresh token.
   * @param token The refresh token to verify.
   * @returns The payload of the token if it is valid.
   */
  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.verifyToken(token, this.refreshTokenSecret);
  }
}

export default new AuthToken();