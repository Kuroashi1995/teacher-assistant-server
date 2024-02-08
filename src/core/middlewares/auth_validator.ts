import { NextFunction, Request, Response } from "express";
import crypto = require("crypto");

export async function authValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const mockedCredentials = {
    username: "kuroashi",
    password: "alaputa",
  };
  try {
    const { authorization } = req.headers;
    console.log({ authorization });
    if (!!!authorization) {
      console.log("authenticate needed");
      res.set("WWW-Authenticate", 'Basic realm="401"'); // change this
      res.status(401).send("Authentication required.");
    } else {
      const code = authorization.split(" ")[1];
      console.log({ code });
      const decoded = Buffer.from(code, "base64").toString();
      const [_, decodedUsername, decodedPassword] =
        decoded.match(/(.*?):(.*)/) || []; //encontre este regex en internet, y quise entender pq tiraba tres resultados, so down the rabbit hole we go brb
    }
  } catch (err) {}
}
