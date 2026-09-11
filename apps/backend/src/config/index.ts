import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const INSECURE_JWT_SECRETS = [
  'change-this-to-a-secure-secret-in-production',
  'secret',
  'jwt-secret',
  'password',
  '123456',
  'dev-secret-change-in-production-1234567890',
  'default-secret',
] as const;

export const envSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z
      .string()
      .url()
      .default('postgresql://openplm:openplm@localhost:5432/openplm'),
    JWT_SECRET: z.string().min(1).default('dev-secret-change-in-production-1234567890'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      const isKnownInsecure = INSECURE_JWT_SECRETS.some(
        (insecure) => data.JWT_SECRET.toLowerCase() === insecure.toLowerCase(),
      );

      if (isKnownInsecure || data.JWT_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_SECRET'],
          message:
            'In production, JWT_SECRET must be at least 32 characters and cannot use default/insecure values.',
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    LOG_LEVEL: data.LOG_LEVEL ?? (data.NODE_ENV === 'production' ? 'info' : 'debug'),
  }));

export type Config = z.infer<typeof envSchema>;

/**
 * Validates arbitrary environment record without process termination.
 * Useful for unit tests and configuration assertions.
 */
export function validateConfig(rawEnv: Record<string, unknown> = process.env) {
  return envSchema.safeParse(rawEnv);
}

/**
 * Loads and validates application configuration from environment.
 * In non-test environments, terminates the process if validation fails.
 */
export function loadConfig(rawEnv: Record<string, unknown> = process.env): Config {
  const result = validateConfig(rawEnv);

  if (!result.success) {
    // Sanitize output so secret values are never printed
    const fieldErrors = result.error.flatten().fieldErrors;
    console.error('❌ Invalid environment configuration:');
    for (const [field, errors] of Object.entries(fieldErrors)) {
      console.error(`   - ${field}: ${errors?.join(', ')}`);
    }

    if (rawEnv.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

export const config: Config = loadConfig(process.env);
