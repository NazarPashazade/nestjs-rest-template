# nestjs-rest-template

A NestJS REST API template with PostgreSQL, TypeORM, JWT authentication, and Winston logging.

## Tech stack

- [NestJS 11](https://nestjs.com/) on the **Fastify** adapter
- [TypeORM 0.3](https://typeorm.io/) + PostgreSQL
- Passport JWT authentication with role-based guards
- Winston logging
- Yarn

## Prerequisites

- Node.js 20+
- Yarn
- A running PostgreSQL instance. The easiest way is the Docker Compose setup in the [stack repository](https://github.com/NazarPashazade/stack/tree/main/database), which starts PostgreSQL and pgAdmin.

## Getting started

1. Install dependencies:

    ```sh
    yarn install
    ```

2. Create the database named in `POSTGRES_DB` (for example, `demo-db`) using pgAdmin or `psql`. The Postgres container only creates the default `postgres` database.

3. Configure environment variables in `.env` (see [Environment variables](#environment-variables)).

4. Start the app:

    ```sh
    yarn start:local
    ```

    The API listens on <http://localhost:3000> by default.

On startup the app automatically:

- runs pending migrations (`migrationsRun: true`), and
- seeds roles and an admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Environment variables

| Variable            | Description                                              | Example                 |
| ------------------- | -------------------------------------------------------- | ----------------------- |
| `NODE_ENV`          | Node environment                                         | `development`           |
| `APP_ENV`           | `local` binds to `127.0.0.1`, anything else to `0.0.0.0` | `local`                 |
| `PORT`              | HTTP port (defaults to `3000`)                           | `3000`                  |
| `WEB_BASE_URL`      | Frontend base URL                                        | `http://localhost:4200` |
| `ADMIN_EMAIL`       | Seeded admin user's email                                | `admin@example.com`     |
| `ADMIN_PASSWORD`    | Seeded admin user's password                             |                         |
| `POSTGRES_HOST`     | Database host                                            | `localhost`             |
| `POSTGRES_PORT`     | Database port                                            | `5432`                  |
| `POSTGRES_DB`       | Database name                                            | `demo-db`               |
| `POSTGRES_USER`     | Database user                                            | `postgres`              |
| `POSTGRES_PASSWORD` | Database password                                        |                         |
| `JWT_SECRET`        | Secret used to sign JWTs                                 |                         |

## Scripts

| Command                   | Description                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `yarn start:local`        | Run with nodemon + ts-node, loading `.env`                                                                   |
| `yarn start:dev`          | Run in Nest watch mode                                                                                       |
| `yarn start:debug`        | Run in watch mode with the debugger attached                                                                 |
| `yarn build`              | Compile to `dist/`                                                                                           |
| `yarn start:prod`         | Run the compiled app from `dist/`                                                                            |
| `yarn postman:sync`       | Push the Postman collection to your Postman workspace, replacing the imported copy (needs `POSTMAN_API_KEY`) |
| `yarn swagger:generate`   | Build and write the OpenAPI spec to `swagger/openapi.json` (no database needed)                              |
| `yarn lint`               | Lint and auto-fix with ESLint                                                                                |
| `yarn format`             | Format with Prettier                                                                                         |
| `yarn test`               | Run unit tests with Jest                                                                                     |
| `yarn migration:generate` | Generate a migration from entity changes into `src/modules/db/migrations/`                                   |
| `yarn migration:run`      | Run pending migrations                                                                                       |
| `yarn run:seeders`        | Run the seeders standalone                                                                                   |

## API

| Method | Path                        | Auth         | Description                                                |
| ------ | --------------------------- | ------------ | ---------------------------------------------------------- |
| `GET`  | `/`                         |              | Health check                                               |
| `POST` | `/auth/register`            |              | Create an account (member role, email unverified)          |
| `POST` | `/auth/verify-email`        |              | Verify an email with the token from the verification email |
| `POST` | `/auth/resend-verification` |              | Send the verification email again                          |
| `POST` | `/auth/forgot-password`     |              | Send a password reset email                                |
| `POST` | `/auth/reset-password`      |              | Set a new password with the token from the reset email     |
| `POST` | `/auth/login`               |              | Log in and receive a JWT                                   |
| `GET`  | `/users`                    | Bearer token | List users                                                 |
| `GET`  | `/users/:id`                |              | Get a user by ID                                           |
| `GET`  | `/roles`                    |              | List roles                                                 |

Send the token from `/auth/login` as `Authorization: Bearer <token>`.

All request bodies are validated; unknown fields are rejected with `400`. `/auth/*` routes are rate limited to 10 requests per minute per IP (3 for `resend-verification` and `forgot-password`).

A [Postman collection](postman/nestjs-rest-template.postman_collection.json) with tests for every endpoint is included. Instead of re-importing it after changes, run `yarn postman:sync` with a [Postman API key](https://postman.co/settings/me/api-keys) exported as `POSTMAN_API_KEY` in `~/.zshenv` (read by every zsh shell, including VS Code tasks; `~/.zshrc` is only read by interactive terminals). Never put it in `.env`. The sync replaces the whole collection, so make edits in the repo file rather than in Postman.

### Password reset flow

1. `POST /auth/forgot-password` with `{ "email": "..." }` always returns `202 { "sent": true }`, whether or not the email is registered. For a registered email, a reset link to `WEB_BASE_URL/reset-password?token=...` is sent (written to the log by `MailService`).
2. `POST /auth/reset-password` with `{ "token": "<token from the link>", "password": "N3wStr0ngPass!" }` returns `200 { "success": true }`. The password rules are the same as for registration. Resetting also marks the email as verified, since the link proves the user owns the mailbox.

Reset links expire after 60 minutes and work only once: the token contains a fingerprint of the current password hash, so it stops matching as soon as the password changes. An invalid, expired, or used token returns `400 Token is invalid or has expired`.

### Swagger / OpenAPI

- **Swagger UI:** <http://localhost:3000/docs> (raw JSON at `/docs-json`). Disabled when `NODE_ENV=production`.
- **Spec file:** [`swagger/openapi.json`](swagger/openapi.json). Regenerate it with `yarn swagger:generate` after changing endpoints or DTOs.

Schemas are generated by the `@nestjs/swagger` CLI plugin (configured in `nest-cli.json`) from DTO classes and their `class-validator` rules. The plugin reads files ending in `.dto.ts`, `-input.ts`, `-payload.ts`, and `-connection-types.ts`, so name new DTO files accordingly. The plugin only runs through the Nest CLI: under `yarn start:local` (ts-node), Swagger UI shows the endpoints but without body/response schemas; use `yarn start:dev` for full docs.

### Registration flow

1. `POST /auth/register`

    ```json
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "password": "Str0ngPass!",
        "phoneNumber": "+994501234567",
        "dateOfBirth": "1995-04-12",
        "gender": "FEMALE"
    }
    ```

    `dateOfBirth` and `gender` are optional. The password must be 8–72 characters, and `phoneNumber` must be in international format. Emails are trimmed and lowercased, so they are case-insensitive. Returns `201` with `{ id, email, emailVerified: false }`, or `409` if the email is taken.

2. A verification email is sent after the account is saved. The link points to `WEB_BASE_URL/verify-email?token=...` and is valid for 2 days.

    > No mail provider is configured yet: `MailService` (`src/modules/infrastructure/mail/mail.service.ts`) writes emails to the application log. Replace its `send()` body with a real provider before deploying.

3. `POST /auth/verify-email` with `{ "token": "<token from the link>" }` returns `200 { "success": true }`. Until then, login returns `400 Email is not verified`.

4. `POST /auth/resend-verification` with `{ "email": "..." }` always returns `202 { "sent": true }`, whether or not the email is registered.

## Project structure

```text
src/
├── main.ts                  # Bootstrap: transactions, Fastify, logger, seeders
├── app.module.ts
└── modules/
    ├── auth/                # JWT strategy, guards, authorization decorators, login
    ├── config/              # Environment variables
    ├── db/                  # Data source, migrations, seeders, DbContext
    ├── file/                # File models
    ├── infrastructure/      # Winston logger
    ├── shared/              # Base entities, base repository, Relay-style pagination
    └── user/                # Users and roles: models, repositories, services, controllers
```

### Adding an entity

1. Create the model in `src/modules/<feature>/domain/models/<name>.model.ts`. TypeORM discovers entities by this path and suffix.
2. Create a repository extending `BaseRelayRepository<T>`, register it in `src/modules/db/database.module.ts`, and expose it on `DbContext`.
3. Generate and review a migration:

    ```sh
    yarn migration:generate
    ```

### Protecting routes

Use the decorators in `src/modules/auth/decorators/`:

```ts
@AuthorizeUser()           // any authenticated user
@AuthorizeMember()
@AuthorizeAdmin()
@AuthorizeRoles([...])     // specific roles
```

`@CurrentUser()` injects the JWT payload into a handler.

## Path aliases

`tsconfig.json` defines `@modules/*` and `@config/*`, and `module-alias` is registered in `main.ts`. However, `_moduleAliases` in `package.json` points to `./src` instead of `./dist`, so aliases won't resolve in the compiled build. The code currently uses relative imports.

To enable aliases, point `_moduleAliases` at the build output:

```json
"_moduleAliases": {
  "@modules": "./dist/modules"
}
```

Note that `@config/*` maps to `src/config`, which doesn't exist; the config lives in `src/modules/config` and is reachable as `@modules/config`.

Then import with the alias:

```ts
import { RolesRepository } from '../../modules/user/repositories/roles.repository'; // before
import { RolesRepository } from '@modules/user/repositories/roles.repository'; // after
```
