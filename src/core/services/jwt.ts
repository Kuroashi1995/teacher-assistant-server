import jwt = require("jsonwebtoken");
import { config } from "../config";
import Cryptr from "cryptr";

export class JwtPayload {
  userId: number;
  isAdmin: boolean;
  isTeacher: boolean;
  constructor({
    userId,
    isAdmin,
    isTeacher,
  }: {
    userId: number;
    isAdmin: boolean;
    isTeacher: boolean;
  }) {
    (this.userId = userId),
      (this.isAdmin = isAdmin),
      (this.isTeacher = isTeacher);
  }
}
export type JwtStatus = "expired" | "invalid" | "verified";

export class JwtService {
  static createJwt(payload: JwtPayload) {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: "HS256",
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      expiresIn: config.jwt.expiration,
    });
  }
  static createRefreshJwt({ userId }: { userId: number }) {
    return jwt.sign({ userId: userId }, config.jwt.secret, {
      algorithm: "HS256",
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      expiresIn: config.jwt.refreshTokenExpiration,
    });
  }
  static verifyToken(token: string): { status: JwtStatus; payload?: any } {
    try {
      const payload = jwt.verify(token, config.jwt.secret, {
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
      });
      if (!!payload) {
        return {
          status: "verified",
          payload,
        };
      }
    } catch (e) {
      const [_, error] = e.toString().match(/.*: (.*)/);
      if (error === "jwt expired") {
        return {
          status: "expired",
        };
      } else {
        return {
          status: "invalid",
        };
      }
    }
  }

  static verifyRefreshToken(token: string): { status: JwtStatus } {
    try {
      const payload = jwt.verify(token, config.jwt.secret, {
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
      });
      if (!!payload) {
        return { status: "verified" };
      }
    } catch (e) {
      const [_, error] = e.toString().match(/.*: (.*)/);
      if (error === "jwt expired") {
        return {
          status: "expired",
        };
      } else {
        return {
          status: "invalid",
        };
      }
    }
  }
  static extractPayload(token: string): JwtPayload {
    const [__, payload] = token.match(/.*\.(.*)\..*/);
    const decryptedPayload = atob(payload);
    console.log(decryptedPayload);
    const { userId, isAdmin, isTeacher } = JSON.parse(decryptedPayload);
    return { userId, isAdmin, isTeacher };
  }
}
