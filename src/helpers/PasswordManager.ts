import bcrypt from "bcrypt";

class PasswordManager {
  private saltRounds: number;

  constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  }
}

export default PasswordManager;
