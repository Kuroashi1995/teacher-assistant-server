import { User } from "../../user/domain/model";
import { UserRepository } from "../../user/aplication/user_repository_implementation";
import { AuthRepository } from "./auth_repository_Implementation";
import { Credentials } from "../domain/credentials";
import Cryptr from "cryptr";
import { config } from "../../core/config";

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
  }): Promise<{ code: number; message: string }> {
    const credentials = await this.authRepository.getCredentials({
      usernameOrEmail,
    });
    if (!credentials) {
      return { code: 401, message: "User not found" };
    } else if (this.cr.decrypt(credentials.password) !== password) {
      return { code: 401, message: "incorrect username/email or password" };
    } else {
      return { code: 200, message: "logged in" };
    }
  }
}
