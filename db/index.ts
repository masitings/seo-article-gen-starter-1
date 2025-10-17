import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as articlesSchema from './schema/articles';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...articlesSchema },
});

export * from './schema/auth';
export * from './schema/articles';