import Order from "../models/Order";

class CodeGenerator {
  public generate(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  // This is to get a human readable code
  public async getOrderId() {
    const code = this.generate(6);

    const order = await Order.findOne({
      orderId: code,
    });

    if (order) {
      this.getOrderId();
    }

    return code;
  }
  public getPaymentRef() {
    const code = this.generate(8);

    return `PR-${code}`;
  }

  public getTemporaryPassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+{}[]|:;<>?/";
    let code = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }
}

export default CodeGenerator;
