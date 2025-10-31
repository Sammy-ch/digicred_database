import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from './schema.js';

export function createDb(url: string, authToken: string) {
  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });
  return { db, client };
}

// Export the schema for convenience
export * from './schema.js';


