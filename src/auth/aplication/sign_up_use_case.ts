import { User } from "../../user/domain/model";
import { UserRepository } from "../../user/aplication/user_repository_implementation";
import { AuthRepository } from "./auth_repository_Implementation";
import { Credentials } from "../domain/credentials";
const simplecrypt = require("simplecrypt");

export class SignUpUseCase {
  private userRepository: UserRepository;
  private authRepository: AuthRepository;
  sc;

  constructor({
    userRepository,
    authRepository,
  }: {
    userRepository: UserRepository;
    authRepository: AuthRepository;
  }) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
    this.sc = simplecrypt();
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
    console.log({ savedUser });
    credentials.password = this.sc.encrypt(credentials.password);
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
}
