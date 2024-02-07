import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { config } from "./core/config";
import userRouter from "./user/presentation/user_router";
import { UserRepository } from "./user/aplication/user_repository_implementation";
import { UserDatabase } from "./user/infrastructure/user_database";
import { Database } from "./core/services/db";
import { authRouter } from "./auth/presentation/auth_router";
import { AuthRepository } from "./auth/aplication/auth_repository_Implementation";
import { CredentialsDatabase } from "./auth/infrastructure/credentials_database";
import { SignUpUseCase } from "./auth/aplication/sign_up_use_case";

const app = express();
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

//todo: improve routing and naming, route api is missing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  "/auth",
  authRouter({
    authRepository: new AuthRepository({
      credentialsDatabase: new CredentialsDatabase({
        databaseService: new Database(),
      }),
    }),
    signUpUseCase: new SignUpUseCase({
      authRepository: new AuthRepository({
        credentialsDatabase: new CredentialsDatabase({
          databaseService: new Database(),
        }),
      }),
      userRepository: new UserRepository({
        userDatabase: new UserDatabase({ databaseService: new Database() }),
      }),
    }),
  })
);

app.use(
  "/users",
  userRouter({
    userRepository: new UserRepository({
      userDatabase: new UserDatabase({
        databaseService: new Database(),
      }),
    }),
  })
);
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
