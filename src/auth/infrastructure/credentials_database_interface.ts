import { Credentials } from "../domain/credentials";

export interface CredentialsDatabaseInterface {
  getCredentials(usernameOrUserEmail: string): Promise<Credentials | null>;
  saveCredentials(credentials: Credentials): Promise<Credentials | null>;
  updateCredentials(credentials: Credentials): Promise<Credentials | null>;
}
