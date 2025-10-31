// Export all schema definitions (tables, enums, types, relations)
export * from './schema.js';

// Export database client and connection
export { db, client } from './db.js';

export { sql, eq, and, or, not, gt, gte, lt, lte, ne, ilike, like, isNull, isNotNull, inArray, notInArray, between, notBetween, exists, notExists, asc, desc, count, sum, avg, min, max } from 'drizzle-orm';

