---
paths:
    - 'src/modules/**/handlers/**/*.ts'
    - 'src/modules/**/services/**/*.ts'
---

# Handlers and services

- Handlers (one use case each, `<action>-handler.ts`, public `execute(input)` method) and services extend `BaseHandler`, which property-injects `dbContext` and `logger`. Use `this.dbContext.<repo>`; don't constructor-inject repositories. Other services go through the constructor, followed by `super()`.
- Register new handlers and services in their feature module's `providers`.
- Multi-write operations use `@Transactional()` from `typeorm-transactional`. Side effects that must only happen after commit (emails, external calls) go through `runOnTransactionCommit(...)`, and their failures are logged, not thrown.
- Throw Nest HTTP exceptions (`ConflictException`, `BadRequestException`, `NotFoundException`, ...) with user-facing messages. Endpoints that send mail to a possibly unregistered address must behave the same whether or not the account exists (no user enumeration).
- Unique-constraint races are caught as `QueryFailedError` with Postgres code `23505` and mapped to `ConflictException` (see `register-handler.ts`).
- Hash and compare passwords only through `src/modules/auth/utils/password.ts`.
- Use the injected `Logger` with the class name as context (`this.logger.error(error, MyHandler.name)`), not `console`.
