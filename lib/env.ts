import { z } from 'zod';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  config({ path: '.env.local' });
}

const envSchema = z
  .object({
    REDIS_URL: z.string().min(1),
  })
  .required()
  .readonly();

type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse({
  REDIS_URL: process.env.REDIS_URL,
});

if (!result.success) {
  console.error('Invalid environment variables:', result.error.format());
  process.exit(1);
}

const env = Object.freeze(result.data) as Readonly<Env>;

export type EnvGetter = () => Env;
export const getEnv: EnvGetter = () => env;
