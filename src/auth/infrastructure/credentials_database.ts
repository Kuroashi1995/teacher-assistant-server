import { Database } from "core/services/db";
import { CredentialsDatabaseInterface } from "./credentials_database_interface";
import { Credentials } from "../domain/credentials";
import {
  INSERT_CREDENTIALS,
  SELECT_CREDENTIALS_BY_USERNAME_OR_MAIL,
  UPDATE_CREDENTIALS,
} from "./queries";

export class CredentialsDatabase implements CredentialsDatabaseInterface {
  private dbService: Database;

  constructor({ databaseService }: { databaseService: Database }) {
    this.dbService = databaseService;
  }
  async getCredentials(usernameOrUserEmail: string): Promise<Credentials> {
    try {
      const data = await this.dbService.callDatabase<Credentials>({
        query: SELECT_CREDENTIALS_BY_USERNAME_OR_MAIL,
        operation: Credentials.fromData,
        data: [usernameOrUserEmail],
      });
      return data ? data[0] : null;
    } catch (err) {
      throw new Error(`Error getting credentials: ${err}`);
    }
  }

  async saveCredentials(credentials: Credentials): Promise<Credentials> {
    try {
      const data = await this.dbService.callDatabase<Credentials>({
        query: INSERT_CREDENTIALS,
        operation: Credentials.fromData,
        data: [
          credentials.username,
          credentials.userEmail,
          credentials.password,
          credentials.userId ? credentials.userId.toString() : null,
        ],
      });
      return data ? data[0] : null;
    } catch (err) {
      throw new Error(`Error saving credentials: ${err}`);
    }
  }
  async updateCredentials(credentials: Credentials): Promise<Credentials> {
    try {
      const data = await this.dbService.callDatabase<Credentials>({
        query: UPDATE_CREDENTIALS,
        operation: Credentials.fromData,
        data: [
          credentials.username,
          credentials.userEmail,
          credentials.password,
          credentials.userId.toString(),
        ],
      });
      return data ? data[0] : null;
    } catch (err) {
      throw new Error(`Error updating credentials: ${err}`);
    }
  }
}
