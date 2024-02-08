import { AuthRepository } from "../aplication/auth_repository_Implementation";
import { Router, Request, Response, NextFunction } from "express";
import { SignUpAndLoginUseCase } from "../aplication/sign_up_use_case";

export function authRouter({
  authRepository,
  signUpAndLoginUseCase,
}: {
  authRepository: AuthRepository;
  signUpAndLoginUseCase: SignUpAndLoginUseCase;
}) {
  const authRouter = Router();

  authRouter.post(
    "/sign-up",
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const { user, credentials } =
        signUpAndLoginUseCase.userAndCredentialsFromData(data);
      const success = await signUpAndLoginUseCase.saveUserAndData({
        user,
        credentials,
      });
      if (success) {
        res.status(200).send({
          message: "User created successfully",
        });
      } else {
        res.send(500);
      }
    }
  );

  authRouter.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      const { usernameOrEmail, password } = req.body;
      const { code, message } = await signUpAndLoginUseCase.validateLogin({
        usernameOrEmail,
        password,
      });
      res.status(code).send({ message: message });
    }
  );
  return authRouter;
}
