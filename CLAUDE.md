# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Yarn (`yarn.lock`).

- `yarn start:dev` — Nest watch mode
- `yarn start:local` — nodemon + ts-node, loads `.env` via `dotenv`
- `yarn build` / `yarn start:prod` — compile to `dist/` and run
- `yarn lint` — ESLint with `--fix`; `yarn format` — Prettier
- `yarn test` — Jest (`*.spec.ts` under `src/`); single file: `yarn test src/modules/user/services/user.service.spec.ts`, single test: add `-t "name"`. No spec files or `test/` directory exist yet, so `test:e2e` has no config.
- `yarn migration:generate` — builds, then generates a migration into `src/modules/db/migrations/` (named `<timestamp>-mg.ts`) by diffing entities against the DB
- `yarn migration:run` — builds and runs pending migrations
- `yarn run:seeders` — runs the seeder service standalone

A Postgres instance is required; the README points to a Docker Compose setup at https://github.com/NazarPashazade/stack/tree/main/database. Env vars (`.env` is loaded by `import 'dotenv/config'` at the top of `main.ts`, then read as constants in `src/modules/config/environment.ts`, not through `ConfigService` — keep that import first): `APP_ENV`, `NODE_ENV`, `PORT`, `POSTGRES_*`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`.

## Architecture

NestJS 11 on the **Fastify** adapter (not Express), TypeORM 0.3 + Postgres, Passport JWT auth, Winston logging.

### Startup (`src/main.ts`)
1. `typeorm-transactional` is initialized before the app is created, and `DatabaseModule` registers the DataSource with `addTransactionalDataSource` — both required for `@Transactional()`.
2. `migrationsRun: true` in `src/modules/db/postgres-connection-options.ts` applies pending migrations on boot; `synchronize` is off, so schema changes need a generated migration.
3. `SeederService.runSeedsAsync()` runs on **every** startup (roles, then users/admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`), so seeders must be idempotent.
4. Binds to `127.0.0.1` when `APP_ENV=local`, otherwise `0.0.0.0`.

### Data access
- Entities live in `src/modules/*/domain/models/*.model.ts`; TypeORM discovers them by that glob, so new entities must follow the path/suffix.
- Custom repositories (e.g. `UsersRepository`) extend `BaseRelayRepository<T>` and are constructed with `dataSource.createEntityManager()`. They are registered centrally in `src/modules/db/database.module.ts` (the `repositories` array), not in feature modules.
- `DbContext` (`src/modules/db/db-context.ts`) exposes every repository as a property. `DatabaseModule` is `@Global` and exports `DbContext`. When adding a repository, add it to both `database.module.ts` and `DbContext`.
- Services extend `BaseHandler` (`src/modules/shared/queries/base-handler.ts`), which property-injects `dbContext` and `logger`. Services use `this.dbContext.<repo>` rather than constructor-injecting repositories.
- List endpoints return a Relay-style `Connection<TNode>` (`totalCount`, `edges[{node}]`, `pageInfo`) built by `getConnectionFromArray` in `src/modules/shared/types/pagination.helper.ts`; node classes are converted with `class-transformer` `plainToClass`. Per-entity node/connection types live in `src/modules/<feature>/types/*-connection-types.ts`.

### Auth
- `JwtStrategy` reads a Bearer token signed with `JWT_SECRET`, and `CustomAuthGuard` enforces roles from `'roles'` metadata against `JwtPayload.role`.
- Protect routes with the decorators in `src/modules/auth/decorators/`: `@AuthorizeUser()`, `@AuthorizeMember()`, `@AuthorizeAdmin()`, `@AuthorizeRoles([...])`. Passing `{ resolveNullIfUnauthorized: true }` swaps the guard for `EmptyIfUnauthorizedInterceptor`, which returns `null` instead of throwing 401/403.
- `@CurrentUser()` gets the JWT payload.
- Email-verification and password-reset tokens are JWTs signed with the same `JWT_SECRET` and carry a `purpose` claim (`TokenPurpose` in `auth.service.ts`). Access-token validation rejects any payload with `purpose` or without `id`; keep both checks when adding token types.
- Password reset tokens also carry `passwordFingerprint` (see `auth/utils/password.ts`); `verifyPasswordResetTokenAsync` compares it with the user's current hash, which makes reset links single-use without a DB table.
- Registration flow: `RegisterHandler` (`@Transactional`) creates the user + `UserDetails` (login requires `details`), then sends the verification email via `runOnTransactionCommit`. `MailService` in `infrastructure/mail` only logs mail — no provider is configured.

### Validation
A global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) runs in `main.ts`. Every `@Body()` class needs `class-validator` decorators on each field, or the field is rejected as unknown. Password hashing goes through `auth/utils/password.ts`.

### Global modules
`InfrastructureModule` (Winston-backed `Logger`) and `DatabaseModule` are `@Global`, so feature modules don't import them.

## Conventions / gotchas

- Imports are relative. `tsconfig.json` defines `@modules/*` and `@config/*` paths, and `module-alias` is registered in `main.ts`, but `_moduleAliases` in `package.json` points at `./src`, not `./dist`, and the alias imports in the code are commented out. Don't introduce alias imports unless you fix the runtime mapping.
- The seeder directory is spelled `seaders/` (`roles.seader.ts`, `users.seaders.ts`).
- TS is loosely configured (`strictNullChecks: false`, `noImplicitAny: false`).
- Dependencies stay on NestJS 11 and TypeORM 0.3 on purpose: NestJS 12 is ESM-only and TypeORM 1.x has breaking changes, while this project is CommonJS.
- ESLint uses the flat config in `eslint.config.mjs`.
