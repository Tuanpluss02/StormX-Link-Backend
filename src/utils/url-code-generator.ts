import * as crypto from "crypto";

export class UrlCodeGenerator {
  private static readonly BASE62_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private static readonly DEFAULT_LENGTH = 7; // Increased from 6 for better collision resistance

  /**
   * Generate a random URL code using base62 encoding
   * @param length The length of the code (default: 7)
   * @returns A random URL code
   */
  static generateRandomCode(length: number = this.DEFAULT_LENGTH): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, this.BASE62_CHARS.length);
      result += this.BASE62_CHARS[randomIndex];
    }
    return result;
  }

  /**
   * Generate a URL code using timestamp and random components
   * This reduces collision probability significantly
   * @returns A unique URL code
   */
  static generateTimestampBasedCode(): string {
    const timestamp = Date.now().toString(36); // Convert to base36
    const randomPart = this.generateRandomCode(4);
    return `${timestamp}${randomPart}`;
  }

  /**
   * Generate a URL code with retry mechanism for collision handling
   * @param checkExistence Function to check if code already exists
   * @param maxRetries Maximum number of retries (default: 5)
   * @returns A unique URL code
   */
  static async generateUniqueCode(
    checkExistence: (code: string) => Promise<boolean>,
    maxRetries: number = 5,
  ): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      const code = this.generateRandomCode();
      const exists = await checkExistence(code);
      if (!exists) {
        return code;
      }
    }

    // If all retries failed, use timestamp-based approach
    return this.generateTimestampBasedCode();
  }

  /**
   * Generate a hash-based URL code from a long URL
   * Useful for deterministic short codes
   * @param longUrl The original URL
   * @returns A hash-based URL code
   */
  static generateHashBasedCode(longUrl: string): string {
    const hash = crypto.createHash("sha256").update(longUrl).digest();
    let result = "";

    for (let i = 0; i < this.DEFAULT_LENGTH; i++) {
      const index = hash[i] % this.BASE62_CHARS.length;
      result += this.BASE62_CHARS[index];
    }

    return result;
  }
}

// Legacy function for backwards compatibility
export const genUrlCode = (): string => {
  return UrlCodeGenerator.generateRandomCode();
};
