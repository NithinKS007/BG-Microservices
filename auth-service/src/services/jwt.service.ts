import jwt from "jsonwebtoken";
import { IJwtPayload, IJwtService } from "../interfaces/interfaces";

export class JwtService implements IJwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiration: number;
  private readonly refreshExpiration: number;

  constructor() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables.");
    }
    const accessExp = Number(process.env.ACCESS_TOKEN_EXPIRATION);
    if (isNaN(accessExp)) {
      throw new Error(
        "Missing or invalid ACCESS_TOKEN_EXPIRATION in environment variables."
      );
    }

    const refreshExp = Number(process.env.REFRESH_TOKEN_EXPIRATION);
    if (isNaN(refreshExp)) {
      throw new Error(
        "Missing or invalid REFRESH_TOKEN_EXPIRATION in environment variables."
      );
    }

    this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    this.accessExpiration = accessExp;
    this.refreshExpiration = refreshExp;
  }

  async createAccessToken(payload: IJwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.accessSecret,
        { expiresIn: this.accessExpiration },
        (err, token) => {
          if (err || !token) return reject(err);
          resolve(token);
        }
      );
    });
  }

  async createRefreshToken(payload: IJwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.refreshSecret,
        { expiresIn: this.refreshExpiration },
        (err, token) => {
          if (err || !token) return reject(err);
          resolve(token);
        }
      );
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
