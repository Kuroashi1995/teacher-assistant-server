import { Credentials } from "../domain/credentials";

export interface AuthRepositoryInterface {
  getCredentials({
    usernameOrEmail,
  }: {
    usernameOrEmail: string;
  }): Promise<Credentials>;

  saveCredentials({
    credentials,
  }: {
    credentials: Credentials;
  }): Promise<Credentials>;

  updateCredentials({
    credentials,
  }: {
    credentials: Credentials;
  }): Promise<Credentials>;
}
