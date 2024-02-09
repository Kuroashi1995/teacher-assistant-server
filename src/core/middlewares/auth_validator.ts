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
      //despues de un curso intensivo de regex, ya entendi match me devuelve primero el match de la regex literal, que en este caso seria cualquier string que contenga
      //una substring opcional de cualquier caracter hasta encontrar un :, luego la segunda substring que puede contener inclusive otro :, en este caso, responderia primero
      //con la combinacion entera de username:password, pero como esta configurada para buscar por grupos, (), match me devuelve como variables adicionales los grupos de datos

      //debido a vulnerabilidadeas de timing attacks, es necesario corroborar la igualdad de passwords a traves de un algoritmo de tiempo constante
      const secretByteLen = Buffer.byteLength(mockedCredentials.password);
      const inputByteLen = Buffer.byteLength(decodedPassword);

      const secretBuffer = Buffer.alloc(secretByteLen, 0, "utf8");
      secretBuffer.write(mockedCredentials.password);

      const inputBuffer = Buffer.alloc(inputByteLen, 0, "utf8");
      inputBuffer.write(decodedPassword);

      if (
        crypto.timingSafeEqual(inputBuffer, secretBuffer) &&
        secretByteLen === inputByteLen &&
        mockedCredentials.username === decodedUsername
      ) {
        res.status(200).send("Authenticated");
      } else {
        res.status(401).send("Failed authentication");
      }
    }
  } catch (err) {}
}
