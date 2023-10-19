import crypto from "crypto";

class SecureDataHandler {
  private algorithm: string;
  constructor(algorithm = "aes-256-cbc") {
    this.algorithm = algorithm;
  }

  generateEncryptionKey() {
    return crypto.randomBytes(32);
  }

  generateInitializationVector() {
    return crypto.randomBytes(16);
  }

  encryptData(data: string, key: crypto.CipherKey, iv: crypto.BinaryLike) {
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    return cipher.update(data, "utf8", "hex") + cipher.final("hex");
  }

  decryptData(
    encryptedData: string,
    key: crypto.CipherKey,
    iv: crypto.BinaryLike,
  ) {
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    return (
      decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8")
    );
  }
}
export default SecureDataHandler;
