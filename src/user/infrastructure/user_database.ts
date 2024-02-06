import { Database } from "../../core/services/db";
import { UserDatabaseInterface } from "./user_database_interface";
import { User } from "../domain/model";
import { SELECT_ALL_USERS, SELECT_USER_BY_ID } from "./queries";

export class UserDatabase implements UserDatabaseInterface {
  private dbService: Database;
  constructor({
    databaseService,
  }: {
    /**
     * Database instance
     */ databaseService: Database;
  }) {
    this.dbService = databaseService;
  }
  async getAllUsers(): Promise<User[] | null> {
    try {
      const users = await this.dbService.callDatabase<User>({
        query: SELECT_ALL_USERS,
        operation: User.fromData,
      });
      return users ? users : null;
    } catch (err) {
      throw new Error(`Could not get all users: ${err}`);
    }
  }
  async getUserById(id: string): Promise<User | null> {
    const response = await this.dbService.callDatabase<User>({
      query: SELECT_USER_BY_ID,
      operation: User.fromData,
      data: [id],
    });
    return response ? response[0] : null;
  }
}
