import { NextFunction, Request, Response, Router } from "express";
import { UserRepository } from "../application/user_repository_implementation";

export default function userRouter({
  userRepository,
}: {
  /**
   * An instance of the User repository
   */
  userRepository: UserRepository;
}) {
  const usersRouter = Router();

  usersRouter.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await userRepository.getAllUsers();
        res.status(200).send(data ? data : { error_message: "no data found" });
      } catch (err) {
        throw new Error(`Could not get users: ${err}`);
      }
    }
  );

  usersRouter.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const data = await userRepository.getUserById(id);
        res.status(200).send(data ? data : { error_meesage: "no data found" });
      } catch (err) {
        throw new Error(`Could not get user: ${err}`);
      }
    }
  );
  return usersRouter;
}
