# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Yarn (`yarn.lock`).

- `yarn start:dev` — Nest watch mode
- `yarn start:local` — nodemon + ts-node, loads `.env` via `dotenv`
- `yarn build` / `yarn start:prod` — compile to `dist/` and run
- `yarn lint` — ESLint with `--fix` (code-quality rules only); `yarn format` / `yarn format:check` — Prettier over the whole repo. A husky pre-commit hook runs lint-staged (ESLint + Prettier on staged files).
- `yarn test` — Jest (`*.spec.ts` under `src/`); single file: `yarn test src/modules/user/services/user.service.spec.ts`, single test: add `-t "name"`. No spec files or `test/` directory exist yet, so `test:e2e` has no config.
- `yarn migration:generate src/modules/db/migrations/<Name>` — builds, then generates `<timestamp>-<Name>.ts` by diffing entities against the DB
- `yarn migration:run` / `yarn migration:revert` — builds, then runs pending migrations / reverts the last one
- `yarn run:seeders` — runs the seeder service standalone

A Postgres instance is required; the README points to a Docker Compose setup at https://github.com/NazarPashazade/stack/tree/main/database. Env vars (copy `.env.example` to `.env`, which is git-ignored; it is loaded by `import 'dotenv/config'` at the top of `main.ts`, then read as constants in `src/modules/config/environment.ts`, not through `ConfigService` — keep that import first): `APP_ENV`, `NODE_ENV`, `PORT`, `LOG_LEVEL` (defaults to `info` in production, `debug` otherwise), `POSTGRES_*`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `WEB_BASE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`.

## Architecture

NestJS 11 on the **Fastify** adapter (not Express), TypeORM 0.3 + Postgres, Passport JWT auth, Winston logging.

### Startup (`src/main.ts`)

1. `typeorm-transactional` is initialized before the app is created, and `DatabaseModule` registers the DataSource with `addTransactionalDataSource` — both required for `@Transactional()`.
2. `migrationsRun: true` in `src/modules/db/postgres-connection-options.ts` applies pending migrations on boot; `synchronize` is off, so schema changes need a generated migration.
3. `SeederService.runSeedsAsync()` runs on **every** startup (roles, then users/admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`), so seeders must be idempotent.
4. Binds to `127.0.0.1` when `APP_ENV=local`, otherwise `0.0.0.0`.

### Layout

Feature modules live in `src/modules/<feature>/` with `controllers/`, `handlers/` (one use case each) or `services/`, `domain/models/` (entities), `repositories/`, `dto/` and `types/`. Handlers and services extend `BaseHandler` and reach data through the global `DbContext`. A global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) runs in `main.ts`. List endpoints return Relay-style `Connection<TNode>` built by `src/modules/shared/types/pagination.helper.ts`.

Area-specific rules live in `.claude/rules/` and load when matching files are touched: `api.md` (controllers, DTOs, Swagger), `api-docs.md` (keeping Swagger and Postman in sync), `database.md` (entities, repositories, seeders), `migrations.md`, `handlers-and-services.md`, `auth.md`, `mail.md`, `postman.md`. `git.md` (branches, commits, PRs) always loads.

### Global modules

`InfrastructureModule` (Winston-backed `Logger`) and `DatabaseModule` are `@Global`, so feature modules don't import them.

## Conventions / gotchas

- Imports are relative. `tsconfig.json` defines `@modules/*` and `@config/*` paths, and `module-alias` is registered in `main.ts`, but `_moduleAliases` in `package.json` points at `./src`, not `./dist`, and the alias imports in the code are commented out. Don't introduce alias imports unless you fix the runtime mapping.
- The seeder directory is spelled `seaders/` (`roles.seader.ts`, `users.seaders.ts`).
- TS is loosely configured (`strictNullChecks: false`, `noImplicitAny: false`).
- Dependencies stay on NestJS 11 and TypeORM 0.3 on purpose: NestJS 12 is ESM-only and TypeORM 1.x has breaking changes, while this project is CommonJS.
- ESLint uses the flat config in `eslint.config.mjs` with `eslint-config-prettier`; formatting is Prettier's job only (`.prettierrc`: 4 spaces, 120 columns, 2 spaces for JSON/YAML), so don't add formatting rules to ESLint.
