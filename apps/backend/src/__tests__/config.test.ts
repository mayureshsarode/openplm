import { describe, it, expect } from 'vitest';
import { validateConfig } from '../config/index.js';

describe('Configuration Module', () => {
  it('should validate and parse default development configuration', () => {
    const result = validateConfig({
      NODE_ENV: 'development',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.LOG_LEVEL).toBe('debug');
      expect(result.data.JWT_SECRET).toBeDefined();
      expect(result.data.CORS_ORIGIN).toBe('http://localhost:5173');
    }
  });

  it('should coerce and accept valid custom configuration', () => {
    const result = validateConfig({
      PORT: '8080',
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://usr:pwd@localhost:5433/customdb',
      JWT_SECRET: 'custom-dev-secret-for-testing-purposes',
      CORS_ORIGIN: 'https://plm.example.com',
      LOG_LEVEL: 'warn',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080);
      expect(result.data.NODE_ENV).toBe('test');
      expect(result.data.DATABASE_URL).toBe(
        'postgresql://usr:pwd@localhost:5433/customdb',
      );
      expect(result.data.LOG_LEVEL).toBe('warn');
      expect(result.data.CORS_ORIGIN).toBe('https://plm.example.com');
    }
  });

  it('should reject non-positive integer ports', () => {
    const result = validateConfig({
      PORT: '-1',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('PORT');
    }
  });

  it('should reject invalid database URLs', () => {
    const result = validateConfig({
      DATABASE_URL: 'not-a-valid-url',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('DATABASE_URL');
    }
  });

  describe('Production Security Constraints', () => {
    it('should reject default insecure JWT secret in production', () => {
      const result = validateConfig({
        NODE_ENV: 'production',
        JWT_SECRET: 'change-this-to-a-secure-secret-in-production',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors).toHaveProperty('JWT_SECRET');
        // Verify secret value is NOT exposed in the error message
        const errorMessage = errors.JWT_SECRET?.join(' ') ?? '';
        expect(errorMessage).not.toContain(
          'change-this-to-a-secure-secret-in-production',
        );
      }
    });

    it('should reject JWT secret shorter than 32 characters in production', () => {
      const result = validateConfig({
        NODE_ENV: 'production',
        JWT_SECRET: 'short-secret-under-32-chars',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors).toHaveProperty('JWT_SECRET');
      }
    });

    it('should accept strong 32+ character JWT secret in production and default to info log level', () => {
      const result = validateConfig({
        NODE_ENV: 'production',
        JWT_SECRET: 'a-very-strong-and-sufficiently-long-production-jwt-secret-key-12345',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('production');
        expect(result.data.LOG_LEVEL).toBe('info');
      }
    });
  });
});
