import { User } from "../domain/model";
import { UserRepositoryInterface } from "./user_repository";
import { UserDatabase } from "../infrastructure/user_database";

export class UserRepository implements UserRepositoryInterface {
  private userDatabase: UserDatabase;
  constructor({
    userDatabase,
  }: {
    /**
     * User database instance
     */ userDatabase: UserDatabase;
  }) {
    this.userDatabase = userDatabase;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userDatabase.getAllUsers();
  }

  async getUserById(id: string): Promise<User> {
    return await this.userDatabase.getUserById(id);
  }

  async saveUser(user: User): Promise<User> {
    return await this.userDatabase.saveUser(user);
  }
}
