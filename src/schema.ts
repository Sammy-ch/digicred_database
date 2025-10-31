import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Enums
export const userRoleEnum = ['ADMIN', 'CUSTOMER'] as const;
export const transactionTypeEnum = ['DEPOSIT', 'WITHDRAWAL', 'REPAYMENT'] as const;
export const creditStatusEnum = ['PENDING', 'APPROVED', 'REJECTED', 'REPAID'] as const;

// User table
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
  image: text('image'),
  role: text('role', { enum: userRoleEnum }).notNull().default('CUSTOMER'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// Session table
export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// Account table
export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// Verification table
export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// JWKS table for JWT key storage
export const jwks = sqliteTable('jwks', {
  id: text('id').primaryKey(),
  publicKey: text('public_key').notNull(),
  privateKey: text('private_key').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// SavingsAccount table
export const savingsAccounts = sqliteTable('savings_account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  balance: real('balance').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// Transaction table
export const transactions = sqliteTable('transaction', {
  id: text('id').primaryKey(),
  savingsId: text('savings_id').notNull().references(() => savingsAccounts.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  type: text('type', { enum: transactionTypeEnum }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// CreditRequest table
export const creditRequests = sqliteTable('credit_request', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  status: text('status', { enum: creditStatusEnum }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  savingsAccounts: many(savingsAccounts),
  creditRequests: many(creditRequests),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));


export const savingsAccountsRelations = relations(savingsAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [savingsAccounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  savingsAccount: one(savingsAccounts, {
    fields: [transactions.savingsId],
    references: [savingsAccounts.id],
  }),
}));

export const creditRequestsRelations = relations(creditRequests, ({ one }) => ({
  user: one(users, {
    fields: [creditRequests.userId],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type SavingsAccount = typeof savingsAccounts.$inferSelect;
export type NewSavingsAccount = typeof savingsAccounts.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type CreditRequest = typeof creditRequests.$inferSelect;
export type NewCreditRequest = typeof creditRequests.$inferInsert;

// Export enum types
export type UserRole = (typeof userRoleEnum)[number];
export type TransactionType = (typeof transactionTypeEnum)[number];
export type CreditStatus = (typeof creditStatusEnum)[number];

// Export enum values for runtime usage
export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  REPAYMENT: 'REPAYMENT'
} as const;


export const schema = {
  users,
  sessions,
  accounts,
  verifications,
  jwks,
  savingsAccounts,
  transactions,
  creditRequests,

  usersRelations,
  sessionsRelations,
  accountsRelations,
  savingsAccountsRelations,
  transactionsRelations,
  creditRequestsRelations,

  userRoleEnum,
  transactionTypeEnum,
  creditStatusEnum,
};

export default schema;
