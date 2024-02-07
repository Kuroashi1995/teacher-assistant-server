import { AuthRepository } from "../aplication/auth_repository_Implementation";
import { Router, Request, Response, NextFunction } from "express";
import { SignUpUseCase } from "../aplication/sign_up_use_case";

export function authRouter({
  authRepository,
  signUpUseCase,
}: {
  authRepository: AuthRepository;
  signUpUseCase: SignUpUseCase;
}) {
  const authRouter = Router();

  authRouter.post(
    "/sign-up",
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const { user, credentials } =
        signUpUseCase.userAndCredentialsFromData(data);
      const success = await signUpUseCase.saveUserAndData({
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
  return authRouter;
}
