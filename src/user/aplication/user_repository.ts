import { User } from "../domain/model";

export interface UserRepositoryInterface {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
}
