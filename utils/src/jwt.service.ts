import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "./env.config";

export interface IJwtService {
  createAccessToken(payload: IJwtPayload): Promise<string>;
  createRefreshToken(payload: IJwtPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<IJwtPayload>;
  verifyRefreshToken(token: string): Promise<IJwtPayload>;
}

export interface IJwtPayload extends JwtPayload {
  id: string;
  role: string;
}
class JwtService implements IJwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiration: number;
  private readonly refreshExpiration: number;

  constructor() {
    if (!envConfig.JWT_ACCESS_TOKEN_SECRET) {
      throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
    }
    if (!envConfig.JWT_REFRESH_TOKEN_SECRET) {
      throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables.");
    }
    const accessExp = Number(envConfig.JWT_ACCESS_TOKEN_EXPIRATION);
    if (isNaN(accessExp)) {
      throw new Error("Missing or invalid ACCESS_TOKEN_EXPIRATION in environment variables.");
    }

    const refreshExp = Number(envConfig.JWT_REFRESH_TOKEN_EXPIRATION);
    if (isNaN(refreshExp)) {
      throw new Error("Missing or invalid REFRESH_TOKEN_EXPIRATION in environment variables.");
    }

    this.accessSecret = envConfig.JWT_ACCESS_TOKEN_SECRET;
    this.refreshSecret = envConfig.JWT_REFRESH_TOKEN_SECRET;
    this.accessExpiration = accessExp;
    this.refreshExpiration = refreshExp;
  }

  async createAccessToken(payload: IJwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.accessSecret, { expiresIn: this.accessExpiration }, (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      });
    });
  }

  async createRefreshToken(payload: IJwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiration }, (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      });
    });
  }

  async verifyAccessToken(token: string): Promise<IJwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.accessSecret, (err, decoded) => {
        if (err) return reject(err);

        if (!decoded || typeof decoded === "string") {
          return reject(new Error("Invalid token payload"));
        }
        const payload = { id: decoded.id, role: decoded.role };
        resolve(payload);
      });
    });
  }

  async verifyRefreshToken(token: string): Promise<IJwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.refreshSecret, (err, decoded) => {
        if (err) return reject(err);

        if (!decoded || typeof decoded === "string") {
          return reject(new Error("Invalid token payload"));
        }
        const payload = { id: decoded.id, role: decoded.role };
        resolve(payload);
      });
    });
  }
}

export const jwtService = new JwtService();
