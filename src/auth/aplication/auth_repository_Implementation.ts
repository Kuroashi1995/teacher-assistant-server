import { CredentialsDatabase } from "../infrastructure/credentials_database";
import { AuthRepositoryInterface } from "./auth_repository_interface";
import { Credentials } from "../domain/credentials";

export class AuthRepository implements AuthRepositoryInterface {
  credentialsDatabase: CredentialsDatabase;

  constructor({
    credentialsDatabase,
  }: {
    credentialsDatabase: CredentialsDatabase;
  }) {
    this.credentialsDatabase = credentialsDatabase;
  }

  async getCredentials({
    usernameOrEmail,
  }: {
    usernameOrEmail: string;
  }): Promise<Credentials> {
    return await this.credentialsDatabase.getCredentials(usernameOrEmail);
  }

  async saveCredentials({
    credentials,
  }: {
    credentials: Credentials;
  }): Promise<Credentials> {
    return await this.credentialsDatabase.saveCredentials(credentials);
  }

  async updateCredentials({
    credentials,
  }: {
    credentials: Credentials;
  }): Promise<Credentials> {
    return await this.credentialsDatabase.updateCredentials(credentials);
  }
}
