import { PasswordUtil } from './password-util';

describe('PasswordUtil', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordUtil.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await PasswordUtil.hashPassword(password);
      const hash2 = await PasswordUtil.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordUtil.hashPassword(password);
      
      const isMatch = await PasswordUtil.comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await PasswordUtil.hashPassword(password);
      
      const isMatch = await PasswordUtil.comparePassword(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordUtil.hashPassword(password);
      
      const isMatch = await PasswordUtil.comparePassword('', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});