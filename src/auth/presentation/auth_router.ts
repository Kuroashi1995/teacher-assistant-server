import { AuthRepository } from "../application/auth_repository_Implementation";
import { Router, Request, Response, NextFunction } from "express";
import { SignUpAndLoginUseCase } from "../application/sign_up_use_case";
import { JwtService } from "../../core/services/jwt";

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
      console.log("login requested");
      const { usernameOrEmail, password } = req.body;
      const validatedUser = await signUpAndLoginUseCase.validateLogin({
        usernameOrEmail,
        password,
      });
      console.log({ validatedUser });
      if (!!validatedUser) {
        const authToken = JwtService.createJwt({
          userId: validatedUser.id,
          isAdmin: validatedUser.isAdmin,
          isTeacher: validatedUser.isTeacher,
        });
        const refreshToken = JwtService.createRefreshJwt({
          userId: validatedUser.id,
        });

        res
          .status(200)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .send({
            token: authToken,
          });
      } else {
        res.status(401).send({
          message: "Wrong username or password",
        });
      }
    }
  );

  authRouter.get(
    "/refresh",
    (req: Request, res: Response, next: NextFunction) => {
      const refreshToken = req.cookies.refreshToken;
      const [_, token] = req.headers.authorization.match(/Bearer (.*)/);
      const refreshTokenValidation =
        JwtService.verifyRefreshToken(refreshToken);
      const payload = JwtService.extractPayload(token);
      if (refreshTokenValidation.status === "verified") {
        const newToken = JwtService.createJwt(payload);
        res.status(200).send({ accessToken: newToken });
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    }
  );
  return authRouter;
}
