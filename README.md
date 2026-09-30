# nestjs-rest-template

A NestJS REST API template with PostgreSQL, TypeORM, JWT authentication, and Winston logging.

## Tech stack

- [NestJS 10](https://nestjs.com/) on the **Fastify** adapter
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

| Variable | Description | Example |
| --- | --- | --- |
| `NODE_ENV` | Node environment | `development` |
| `APP_ENV` | `local` binds to `127.0.0.1`, anything else to `0.0.0.0` | `local` |
| `PORT` | HTTP port (defaults to `3000`) | `3000` |
| `WEB_BASE_URL` | Frontend base URL | `http://localhost:4200` |
| `ADMIN_EMAIL` | Seeded admin user's email | `admin@example.com` |
| `ADMIN_PASSWORD` | Seeded admin user's password | |
| `POSTGRES_HOST` | Database host | `localhost` |
| `POSTGRES_PORT` | Database port | `5432` |
| `POSTGRES_DB` | Database name | `demo-db` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | |
| `JWT_SECRET` | Secret used to sign JWTs | |

## Scripts

| Command | Description |
| --- | --- |
| `yarn start:local` | Run with nodemon + ts-node, loading `.env` |
| `yarn start:dev` | Run in Nest watch mode |
| `yarn start:debug` | Run in watch mode with the debugger attached |
| `yarn build` | Compile to `dist/` |
| `yarn start:prod` | Run the compiled app from `dist/` |
| `yarn lint` | Lint and auto-fix with ESLint |
| `yarn format` | Format with Prettier |
| `yarn test` | Run unit tests with Jest |
| `yarn migration:generate` | Generate a migration from entity changes into `src/modules/db/migrations/` |
| `yarn migration:run` | Run pending migrations |
| `yarn run:seeders` | Run the seeders standalone |

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | | Health check |
| `POST` | `/auth/login` | | Log in and receive a JWT |
| `GET` | `/users` | Bearer token | List users |
| `GET` | `/users/:id` | | Get a user by ID |
| `GET` | `/roles` | | List roles |

Send the token from `/auth/login` as `Authorization: Bearer <token>`.

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
import { RolesRepository } from '@modules/user/repositories/roles.repository';      // after
```
