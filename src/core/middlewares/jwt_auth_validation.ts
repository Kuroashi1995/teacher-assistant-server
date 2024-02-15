import { JsonWebTokenError } from "jsonwebtoken";
import { JwtService } from "../services/jwt";
import { NextFunction, Request, Response } from "express";
1;
export function jwtAuthValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const authorization = req.headers.authorization;
    const [_, token] = authorization.match(/Bearer (.*)/);
    const tokenStatus = JwtService.verifyToken(token);
    const refreshTokenStatus = JwtService.verifyRefreshToken(refreshToken);
    if (tokenStatus.status === "verified") {
      next();
    } else if (
      refreshTokenStatus.status === "verified" &&
      tokenStatus.status === "expired"
    ) {
      res.status(401).send({ message: "Access token expired" });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (e) {
    console.log(`Error authenticating jwt: ${e}`);
    res.status(401).send("Unauthorized");
  }
}
