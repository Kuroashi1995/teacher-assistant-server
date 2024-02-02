type Level = "beginner" | "intermediate" | "advanced";
type Turn = "morning" | "afternoon" | "night";

export class User {
  id?: number;
  name: string;
  lastName: string;
  level: Level;
  enrollDate: Date;
  birthDate: Date;
  turn: Turn;
  isAdmin: boolean;
  isTeacher: boolean;
  phoneNumber: string;
  constructor({
    id,
    name,
    lastName,
    level = "beginner",
    enrollDate,
    birthDate,
    turn,
    isAdmin,
    isTeacher,
    phoneNumber,
  }: {
    /**
     * The id number corresponding to the DB, usually comes with the data
     */
    id?: number;
    name: string;
    lastName: string;
    /**
     * The student's current level of english
     */
    level: Level;
    enrollDate: Date;
    birthDate?: Date;
    /**
     * The user's preferred turn for assistance
     */
    turn: Turn;
    /**
     * If the user is an admin of the platform
     */
    isAdmin: boolean;
    /**
     * If the user is a teacher
     */
    isTeacher: boolean;
    phoneNumber: string;
  }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.level = level;
    this.enrollDate = enrollDate;
    this.birthDate = birthDate;
    this.turn = turn;
    this.isAdmin = isAdmin;
    this.isTeacher = isTeacher;
    this.phoneNumber = phoneNumber;
  }
  /**
   * Returns a new User object with the updated properties
   * @param updates A partial User object with the properties to be updated
   * @returns New User object with the properties updated
   */
  update(updates: Partial<User>): User {
    return new User({ ...this, ...updates });
  }

  /**
   * Creates a new User from data
   * @param data An object with the incoming DB data
   * @returns New User object with the properties that came in the data
   */
  static fromData(data: any): User {
    return new User({
      id: data.id,
      name: data.name,
      lastName: data.last_name,
      level: data.level,
      enrollDate: data.enroll_date,
      birthDate: data.birth_date,
      turn: data.turn,
      isAdmin: data.is_admin,
      isTeacher: data.is_teacher,
      phoneNumber: data.phone_number,
    });
  }
  /**
   * Creates a DB object from a User
   * @returns Data in the DB format
   */
  toData() {
    return {
      name: this.name,
      last_name: this.lastName,
      level: this.level,
      enroll_date: this.enrollDate,
      birth_date: this.birthDate,
      turn: this.turn,
      is_admin: this.isAdmin,
      is_teacher: this.isTeacher,
      phone_number: this.phoneNumber,
    };
  }
}
