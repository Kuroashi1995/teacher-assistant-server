import express, { NextFunction, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { config } from "./core/config";
import { authValidator } from "./core/middlewares/auth_validator";
import { RouterConfiguration } from "./core/routing";
import { Database } from "./core/services/db";

//app instantiaton
const app = express();

//app routing configuration and dependency injection
const { appRouter } = new RouterConfiguration({
  databaseService: new Database(),
}).config();

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
//testing endpoint
app.get(
  "/",
  authValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("got to /");
  }
);
app.use("/api", appRouter);

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
