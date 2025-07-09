import { BadRequestException } from "@nestjs/common";

export class ValidationUtil {
  /**
   * Validate username format
   * Rules: 3-20 characters, alphanumeric and underscore only
   */
  static validateUsername(username: string): void {
    if (!username || username.length < 3 || username.length > 20) {
      throw new BadRequestException(
        "Username must be between 3 and 20 characters long",
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException(
        "Username can only contain letters, numbers, and underscores",
      );
    }
  }

  /**
   * Validate password strength
   * Rules: minimum 6 characters, at least one letter and one number
   */
  static validatePassword(password: string): void {
    if (!password || password.length < 6) {
      throw new BadRequestException(
        "Password must be at least 6 characters long",
      );
    }

    if (password.length > 128) {
      throw new BadRequestException("Password cannot exceed 128 characters");
    }

    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      throw new BadRequestException(
        "Password must contain at least one letter and one number",
      );
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string): void {
    if (!url) {
      throw new BadRequestException("URL is required");
    }

    try {
      new URL(url);
    } catch {
      throw new BadRequestException("Invalid URL format");
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, " ");
  }
}
