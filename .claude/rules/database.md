---
paths:
    - 'src/modules/db/**/*.ts'
    - 'src/modules/**/domain/models/**/*.ts'
    - 'src/modules/**/repositories/**/*.ts'
---

# Entities, repositories and seeders

## Entities

- Entities must live at `src/modules/<feature>/domain/models/<name>.model.ts`; TypeORM discovers them by that glob, so any other path or suffix is silently ignored.
- Table names are plural snake_case (`@Entity({ name: 'user_details' })`); multi-word columns set an explicit snake_case `name` (`@Column({ name: 'first_name' })`). Foreign keys get both a `<rel>Id` column and `@JoinColumn({ name: '<rel>_id' })`.
- Primary keys are `@PrimaryGeneratedColumn('uuid')`. Editable entities implement `IEditableEntity` with `created_at` / `updated_at` as `timestamp with time zone` and a `@VersionColumn({ default: 0 })`.

Any entity change needs a migration; see `migrations.md`.

## Repositories

- Custom repositories extend `BaseRelayRepository<T>` and call `super(Entity, dataSource.createEntityManager())`.
- A new repository must be added in **both** places: the `repositories` array in `src/modules/db/database.module.ts` and a property on `DbContext` (`src/modules/db/db-context.ts`). Don't register repositories in feature modules.

## Seeders

- `SeederService.runSeedsAsync()` runs on every app start, so seeders must be idempotent: check for existing rows before inserting. Register new seeders in `seaders/index.ts` and the `seeders` array in `database.module.ts` (the directory is spelled `seaders/` on purpose; don't rename it).
