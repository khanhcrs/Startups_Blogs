import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('api/v1'),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  COGNITO_REGION: z.string().min(1),
  COGNITO_USER_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  AWS_REGION: z.string().min(1),
  S3_PUBLIC_BUCKET: z.string().min(1),
  S3_PRIVATE_BUCKET: z.string().min(1),
  PRESIGNED_URL_TTL_SECONDS: z.coerce.number().int().min(60).max(900).default(300),
});

export function validateEnvironment(config: Record<string, unknown>) {
  return envSchema.parse(config);
}
