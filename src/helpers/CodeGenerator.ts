import Account from "../models/Account";

class CodeGenerator {
  public generate(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  // This is to get a human readable code
  public async getAccountId() {
    const code = this.generate();

    const booking = await Account.findOne({
      reference: code,
    });

    if (booking) {
      this.getAccountId();
    }

    return code;
  }
}

export default CodeGenerator;
