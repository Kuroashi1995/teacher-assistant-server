import { User } from "../../user/domain/model";
import { UserRepository } from "../../user/application/user_repository_implementation";
import { AuthRepository } from "./auth_repository_Implementation";
import { Credentials } from "../domain/credentials";
import Cryptr from "cryptr";
import { config } from "../../core/config";
import crypto = require("crypto");

export class SignUpAndLoginUseCase {
  private userRepository: UserRepository;
  private authRepository: AuthRepository;
  private cr;

  constructor({
    userRepository,
    authRepository,
  }: {
    userRepository: UserRepository;
    authRepository: AuthRepository;
  }) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
    this.cr = new Cryptr(config.cryptr.key);
  }

  userAndCredentialsFromData(data: any) {
    const user = new User(data);
    const credentials = new Credentials(data);
    return { user, credentials };
  }

  async saveUserAndData({
    user,
    credentials,
  }: {
    user: User;
    credentials: Credentials;
  }): Promise<boolean> {
    const savedUser = await this.userRepository.saveUser(user);
    credentials.password = this.cr.encrypt(credentials.password);
    credentials.userId = savedUser.id;
    const savedCredentials = await this.authRepository.saveCredentials({
      credentials,
    });
    if (savedCredentials && savedUser) {
      return true;
    } else {
      return false;
    }
  }
  async validateLogin({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string;
    password: string;
  }): Promise<User | null> {
    const credentials = await this.authRepository.getCredentials({
      usernameOrEmail,
    });
    const savedPassword = this.cr.decrypt(credentials.password);
    console.log({ savedPassword, password });

    const savedPassLen = Buffer.byteLength(savedPassword);
    const inputPassLen = Buffer.byteLength(password);
    console.log({ savedPassLen, inputPassLen });

    const inputBuffer = Buffer.alloc(savedPassLen, 0, "utf8");
    const savedBuffer = Buffer.alloc(inputPassLen, 0, "utf8");
    inputBuffer.write(password);
    savedBuffer.write(savedPassword);

    console.log({ inputBuffer, savedBuffer });

    if (
      (!!crypto.timingSafeEqual(inputBuffer, savedBuffer) &&
        savedPassLen !== inputPassLen) ||
      !!credentials
    ) {
      console.log("got to else");
      const user = await this.userRepository.getUserById(
        credentials.userId.toString()
      );
      return user;
    } else {
      return null;
    }
  }
}
