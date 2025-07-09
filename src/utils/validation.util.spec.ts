import { BadRequestException } from "@nestjs/common";
import { ValidationUtil } from "./validation.util";

describe("ValidationUtil", () => {
  describe("validateUsername", () => {
    it("should accept valid usernames", () => {
      expect(() => ValidationUtil.validateUsername("validuser")).not.toThrow();
      expect(() => ValidationUtil.validateUsername("user123")).not.toThrow();
      expect(() => ValidationUtil.validateUsername("user_name")).not.toThrow();
      expect(() => ValidationUtil.validateUsername("test")).not.toThrow();
    });

    it("should reject usernames that are too short", () => {
      expect(() => ValidationUtil.validateUsername("ab")).toThrow(
        BadRequestException,
      );
      expect(() => ValidationUtil.validateUsername("")).toThrow(
        BadRequestException,
      );
    });

    it("should reject usernames that are too long", () => {
      expect(() => ValidationUtil.validateUsername("a".repeat(21))).toThrow(
        BadRequestException,
      );
    });

    it("should reject usernames with invalid characters", () => {
      expect(() => ValidationUtil.validateUsername("user@name")).toThrow(
        BadRequestException,
      );
      expect(() => ValidationUtil.validateUsername("user-name")).toThrow(
        BadRequestException,
      );
      expect(() => ValidationUtil.validateUsername("user name")).toThrow(
        BadRequestException,
      );
    });
  });

  describe("validatePassword", () => {
    it("should accept valid passwords", () => {
      expect(() =>
        ValidationUtil.validatePassword("password123"),
      ).not.toThrow();
      expect(() => ValidationUtil.validatePassword("abc123")).not.toThrow();
      expect(() =>
        ValidationUtil.validatePassword("StrongP@ss1"),
      ).not.toThrow();
    });

    it("should reject passwords that are too short", () => {
      expect(() => ValidationUtil.validatePassword("12345")).toThrow(
        BadRequestException,
      );
      expect(() => ValidationUtil.validatePassword("")).toThrow(
        BadRequestException,
      );
    });

    it("should reject passwords that are too long", () => {
      expect(() => ValidationUtil.validatePassword("a".repeat(129))).toThrow(
        BadRequestException,
      );
    });

    it("should reject passwords without letters", () => {
      expect(() => ValidationUtil.validatePassword("123456")).toThrow(
        BadRequestException,
      );
    });

    it("should reject passwords without numbers", () => {
      expect(() => ValidationUtil.validatePassword("password")).toThrow(
        BadRequestException,
      );
    });
  });

  describe("validateUrl", () => {
    it("should accept valid URLs", () => {
      expect(() =>
        ValidationUtil.validateUrl("https://example.com"),
      ).not.toThrow();
      expect(() => ValidationUtil.validateUrl("http://test.org")).not.toThrow();
      expect(() =>
        ValidationUtil.validateUrl("https://sub.domain.com/path"),
      ).not.toThrow();
    });

    it("should reject invalid URLs", () => {
      expect(() => ValidationUtil.validateUrl("not-a-url")).toThrow(
        BadRequestException,
      );
      expect(() => ValidationUtil.validateUrl("")).toThrow(BadRequestException);
      expect(() => ValidationUtil.validateUrl("just-text")).toThrow(
        BadRequestException,
      );
    });
  });

  describe("sanitizeString", () => {
    it("should trim and normalize whitespace", () => {
      expect(ValidationUtil.sanitizeString("  hello  world  ")).toBe(
        "hello world",
      );
      expect(ValidationUtil.sanitizeString("test")).toBe("test");
      expect(ValidationUtil.sanitizeString("  test  ")).toBe("test");
    });
  });
});
