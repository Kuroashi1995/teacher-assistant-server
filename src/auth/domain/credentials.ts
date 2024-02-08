export class Credentials {
  username?: string;
  userEmail: string;
  password: string;
  userId: number;

  constructor({
    username,
    userEmail,
    password,
    userId,
  }: {
    username?: string;
    userEmail: string;
    password: string;
    userId: number;
  }) {
    this.username = username;
    this.userEmail = userEmail;
    this.password = password;
    this.userId = userId;
  }

  static fromData(data: any) {
    return new Credentials({
      password: data.user_password,
      userEmail: data.user_email,
      userId: data.user_id,
      username: data.username,
    });
  }

  toData() {
    return {
      user_password: this.password,
      user_email: this.userEmail,
      username: this.username,
      user_id: this.userId,
    };
  }

  update(updatedData: Partial<Credentials>): Credentials {
    return new Credentials({ ...this, ...updatedData });
  }
}
