# digicred_database_repo

A robust and scalable database repository for the DigiCred application, built with [Drizzle ORM](https://orm.drizzle.team/) and designed for [Turso](https://turso.tech/) (SQLite-compatible) databases. This repository manages core application data including user authentication, financial transactions, savings accounts, and credit requests.

## Features

*   **User Management:** Handles user registration, authentication, roles (Admin, Customer), and sessions.
*   **Account Management:** Stores user account details and provider information.
*   **Financial Transactions:** Records deposits, withdrawals, and repayments for savings accounts.
*   **Savings Accounts:** Manages individual user savings balances.
*   **Credit Requests:** Processes and tracks credit applications with various statuses (Pending, Approved, Rejected, Repaid).
*   **JWKS (JSON Web Key Set):** Securely stores public and private keys for JWT (JSON Web Token) operations.
*   **Type-Safe Schema:** Fully type-safe database interactions powered by Drizzle ORM and TypeScript.
*   **Migrations:** Easy database schema evolution with Drizzle Kit migrations.

## Installation

To use this database repository in your project, follow these steps:

1.  **Prerequisites:**
    *   Node.js (LTS version recommended)
    *   npm or Yarn

2.  **Install Dependencies:**
    ```bash
    npm install digicred_database_repo
    # or
    yarn add digicred_database_repo
    ```

    If you are working within the `digicred_database_repo` itself (e.g., for development or contributing), clone the repository and install dependencies:

    ```bash
    git clone <repository-url>
    cd digicred_database_repo
    npm install
    ```

## Configuration

This repository requires environment variables for database connection. Create a `.env` file in the root of your project (or ensure these variables are set in your deployment environment):

```env
DATABASE_URL="your_turso_database_url"
DATABASE_AUTH_TOKEN="your_turso_auth_token"
```

*   `DATABASE_URL`: The connection URL for your Turso database.
*   `DATABASE_AUTH_TOKEN`: The authentication token for your Turso database.

## Usage

### Initializing the Database Client

You can import and use the `db` client from this package to interact with your database:

```typescript
import { db, schema } from 'digicred_database_repo';
import { eq } from 'drizzle-orm';

async function getUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
  return user;
}

// Example: Fetch all users
async function getAllUsers() {
  const users = await db.query.users.findMany();
  console.log(users);
}

getAllUsers();
```

### Schema

The database schema is defined in `src/schema.ts` and includes the following main tables:

*   `users`: Stores user information, including roles.
*   `sessions`: Manages user sessions.
*   `accounts`: Stores external account details linked to users.
*   `verifications`: Handles verification tokens (e.g., email verification).
*   `jwks`: Stores JSON Web Key Sets for JWT signing/verification.
*   `savingsAccounts`: Manages individual savings accounts for users.
*   `transactions`: Records all financial transactions (deposits, withdrawals, repayments).
*   `creditRequests`: Manages user credit requests.

## Development

### Migrations

Drizzle Kit is used for managing database migrations.

*   **Generate a new migration:**
    ```bash
    npm run db:generate # or yarn db:generate
    ```
    This command will create a new migration file in the `migrations` directory based on changes in `src/schema.ts`.

*   **Apply migrations to your database:**
    ```bash
    npm run db:push # or yarn db:push
    ```
    This command applies pending migrations to your configured database.

### Seeding Data

The repository includes a script to seed initial admin users.

*   **Seed Admin Users:**
*   **Seed Admin Users:**
    ```bash
    npm run db:seed:admins # or yarn db:seed:admins
    ```
    This script will create a set of default admin users in your database. Ensure your `.env` file is correctly configured before running.

### Other Development Scripts

*   `npm run db:generate`: Generates new Drizzle migrations based on schema changes.
*   `npm run db:migrate`: This script is typically used to apply migrations when working with a local sqlite database.
*   `npm run db:push`: Pushes schema changes directly to the database, useful for development without creating new migration files.
*   `npm run db:studio`: Opens Drizzle Studio for a visual interface to your database.
*   `npm run build`: Compiles the TypeScript code to JavaScript.
*   `npm run check-types`: Runs TypeScript type checking.

    This script will create a set of default admin users in your database. Ensure your `.env` file is correctly configured before running.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
