import { User } from "../domain/model";

export interface UserDatabaseInterface {
  getAllUsers(): Promise<User[] | null>;
  getUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<User | null>;
}
