---
paths:
    - 'src/modules/db/migrations/**/*.ts'
    - 'src/modules/**/domain/models/**/*.ts'
---

# Migrations

- `synchronize` is off and migrations run on boot (`migrationsRun: true`), so every entity change needs a migration in `src/modules/db/migrations/`.
- Generate migrations from entity changes; don't write them by hand unless the change can't be expressed through entities (data backfills, raw SQL). Generating needs a running Postgres whose schema matches the committed migrations.
- Give every migration a PascalCase name that says what it changes: `yarn migration:generate src/modules/db/migrations/<Name>`, e.g. `AddArticlesAndArticleCategories`, `AddCoverImageToArticles`, `DropUserNickname`. TypeORM writes `<timestamp>-<Name>.ts` with class `<Name><timestamp>`.
- One logical change per migration. Review the generated file before committing: it diffs entities against your local database, so unrelated local drift shows up too and must be removed. Keep `down()` a working reverse of `up()`.
- Never edit, rename or delete a committed migration (file or class): TypeORM records applied migrations by class name, so a renamed class runs again on every database. Add a new migration instead.
- An uncommitted migration that you already applied locally can still change: run `yarn migration:revert`, delete or edit the file, then generate or run it again.
- Reference data the app needs (roles, default categories) goes in idempotent seeders, not migrations.
