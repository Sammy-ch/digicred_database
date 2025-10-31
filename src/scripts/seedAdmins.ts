import { drizzle } from 'drizzle-orm/libsql';
import { eq } from "drizzle-orm";
import { createClient } from '@libsql/client';
import * as schema from '../schema';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcryptjs';

// Load environment variables from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Database connection
const connectionString = process.env.DATABASE_URL.split('?')[0].replace('postgres', 'libsql');
if (!connectionString) {
  console.error('DATABASE_URL is not defined in the environment variables');
  process.exit(1);
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN

});

const db = drizzle(client, { schema });

// Admin user data
const adminUsers = [
  {
    id: uuidv4(),
    name: 'Admin One',
    email: 'admin1@digicred.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
  {
    id: uuidv4(),
    name: 'Admin Two',
    email: 'admin2@digicred.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
  {
    id: uuidv4(),
    name: 'Admin Three',
    email: 'admin3@digicred.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
  {
    id: uuidv4(),
    name: 'Admin Four',
    email: 'admin4@digicred.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
  {
    id: uuidv4(),
    name: 'Admin Five',
    email: 'admin5@digicred.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
];

async function seedAdmins() {
  console.log('Starting admin seed...');

  try {
    // Test the database connection
    console.log('Successfully connected to the database');
    // Insert admin users in a transaction
    await db.delete(schema.users).where(eq(schema.users.role, 'ADMIN'));
    for (const user of adminUsers) {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, user.email),
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        // Insert user
        await db.insert(schema.users).values({
          id: user.id,
          name: user.name,
          email: user.email,
          role: schema.userRoleEnum[0] === 'ADMIN' ? 'ADMIN' : 'CUSTOMER', // Type-safe role assignment
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await db.insert(schema.accounts).values({
          id: uuidv4(),
          userId: user.id,
          providerId: 'Credentials',
          accountId: user.email,
          password: hashedPassword,
        });

        await db.insert(schema.sessions).values({
          id: uuidv4(),
          userId: user.id,
          token: uuidv4(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        });

        console.log(`Created admin user: ${user.email}`);
      } else {
        console.log(`Admin user already exists: ${user.email}`);
      }
    }

    console.log('Admin seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding admins:');
    console.error(error);
    process.exit(1);
  } finally {
    // Close the database connection
    client.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

seedAdmins();
