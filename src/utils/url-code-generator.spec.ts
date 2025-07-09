import { UrlCodeGenerator } from "./url-code-generator";

describe("UrlCodeGenerator", () => {
  describe("generateRandomCode", () => {
    it("should generate a code with default length", () => {
      const code = UrlCodeGenerator.generateRandomCode();
      expect(code).toHaveLength(7);
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("should generate a code with custom length", () => {
      const code = UrlCodeGenerator.generateRandomCode(10);
      expect(code).toHaveLength(10);
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("should generate different codes on multiple calls", () => {
      const code1 = UrlCodeGenerator.generateRandomCode();
      const code2 = UrlCodeGenerator.generateRandomCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("generateTimestampBasedCode", () => {
    it("should generate a code with timestamp component", () => {
      const code = UrlCodeGenerator.generateTimestampBasedCode();
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
      expect(code.length).toBeGreaterThan(4); // Should be timestamp + 4 random chars
    });

    it("should generate different codes on multiple calls", () => {
      const code1 = UrlCodeGenerator.generateTimestampBasedCode();
      const code2 = UrlCodeGenerator.generateTimestampBasedCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("generateHashBasedCode", () => {
    it("should generate deterministic code for same URL", () => {
      const url = "https://example.com";
      const code1 = UrlCodeGenerator.generateHashBasedCode(url);
      const code2 = UrlCodeGenerator.generateHashBasedCode(url);
      expect(code1).toBe(code2);
      expect(code1).toHaveLength(7);
      expect(code1).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("should generate different codes for different URLs", () => {
      const url1 = "https://example.com";
      const url2 = "https://different.com";
      const code1 = UrlCodeGenerator.generateHashBasedCode(url1);
      const code2 = UrlCodeGenerator.generateHashBasedCode(url2);
      expect(code1).not.toBe(code2);
    });
  });

  describe("generateUniqueCode", () => {
    it("should return a unique code when no collision", async () => {
      const checkExistence = jest.fn().mockResolvedValue(false);
      const code = await UrlCodeGenerator.generateUniqueCode(checkExistence);
      expect(code).toHaveLength(7);
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
      expect(checkExistence).toHaveBeenCalledWith(code);
    });

    it("should retry when collision occurs", async () => {
      const checkExistence = jest
        .fn()
        .mockResolvedValueOnce(true) // First call returns collision
        .mockResolvedValueOnce(false); // Second call returns no collision

      const code = await UrlCodeGenerator.generateUniqueCode(checkExistence);
      expect(code).toHaveLength(7);
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
      expect(checkExistence).toHaveBeenCalledTimes(2);
    });

    it("should use timestamp-based code when max retries exceeded", async () => {
      const checkExistence = jest.fn().mockResolvedValue(true); // Always collision
      const code = await UrlCodeGenerator.generateUniqueCode(checkExistence, 2);
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
      expect(code.length).toBeGreaterThan(7); // Should be longer due to timestamp
      expect(checkExistence).toHaveBeenCalledTimes(2);
    });
  });
});
