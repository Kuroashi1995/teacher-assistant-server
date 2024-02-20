import express from "express";
import userRouter from "../user/presentation/user_router";
import { authRouter } from "../auth/presentation/auth_router";
import { AuthRepository } from "../auth/application/auth_repository_Implementation";
import { Database } from "./services/db";
import { UserDatabase } from "../user/infrastructure/user_database";
import { CredentialsDatabase } from "../auth/infrastructure/credentials_database";
import { UserRepository } from "../user/application/user_repository_implementation";
import { SignUpAndLoginUseCase } from "../auth/application/sign_up_use_case";
import { ExercisesUseCase } from "../exercises/application/exercises_use_case";
import { AiService } from "./services/open_ai";
import exercisesRouter from "../exercises/presentation/exercises_router";

/**
 * This class configures routing and dependency injection
 */
export class RouterConfiguration {
  databaseService: Database;
  constructor({
    databaseService,
  }: {
    /**
     * Express application
     */
    databaseService: Database;
  }) {
    this.databaseService = databaseService;
  }
  private initializeDatabases({
    databaseService,
  }: {
    databaseService: Database;
  }) {
    return {
      userDatabase: new UserDatabase({ databaseService }),
      credentialsDatabase: new CredentialsDatabase({
        databaseService,
      }),
    };
  }
  private initializeRepositories({
    userDatabase,
    credentialsDatabase,
  }: {
    userDatabase: UserDatabase;
    credentialsDatabase: CredentialsDatabase;
  }) {
    return {
      authRepository: new AuthRepository({ credentialsDatabase }),
      userRepository: new UserRepository({ userDatabase }),
    };
  }

  private initializeUseCases({
    userRepository,
    authRepository,
  }: {
    userRepository: UserRepository;
    authRepository: AuthRepository;
  }) {
    return {
      signUpAndLoginUseCase: new SignUpAndLoginUseCase({
        authRepository,
        userRepository,
      }),
      exercisesUseCase: new ExercisesUseCase({ aiService: new AiService() }),
    };
  }

  /**
   * This method configures the routers for the app and injects all dependencies needed
   * @returns The Router instance
   */
  config() {
    const appRouter = express.Router();
    const { credentialsDatabase, userDatabase } = this.initializeDatabases({
      databaseService: this.databaseService,
    });
    const { authRepository, userRepository } = this.initializeRepositories({
      credentialsDatabase,
      userDatabase,
    });
    const { signUpAndLoginUseCase, exercisesUseCase } = this.initializeUseCases(
      {
        authRepository,
        userRepository,
      }
    );
    appRouter.use(
      "/auth",
      authRouter({ authRepository, signUpAndLoginUseCase })
    );
    appRouter.use("/users", userRouter({ userRepository }));
    appRouter.use("/exercises", exercisesRouter({ exercisesUseCase }));

    return { appRouter };
  }
}
