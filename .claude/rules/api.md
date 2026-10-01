---
paths:
    - 'src/modules/**/controllers/**/*.ts'
    - 'src/modules/**/dto/**/*.ts'
    - 'src/modules/**/types/**/*.ts'
---

# Controllers, inputs and DTOs

## Controllers

- Controllers stay thin: delegate to a handler (`handler.execute(input)`) or a service, and return its result. No DB access or business logic in controllers.
- Every endpoint gets `@ApiOperation({ summary })` plus an `@Api*Response` decorator for each non-2xx outcome it can produce. Controllers carry `@ApiTags(...)`.
- Non-`GET` endpoints that don't create a resource set `@HttpCode(HttpStatus.OK)` (or `ACCEPTED` for fire-and-forget actions like sending mail).
- Protect routes with the decorators in `src/modules/auth/decorators/` (`@AuthorizeUser()`, `@AuthorizeMember()`, `@AuthorizeAdmin()`, `@AuthorizeRoles([...])`), never with raw `@UseGuards(CustomAuthGuard)`. Add `@ApiBearerAuth()` to protected routes. Use `@CurrentUser()` for the JWT payload.
- Public endpoints that send mail or check credentials need `@UseGuards(ThrottlerGuard)` and, for mail, `@Throttle({ default: { limit: 3, ttl: 60_000 } })`.

## Request/response classes

- File naming matters: the `@nestjs/swagger` CLI plugin only generates schemas for files ending in `.dto.ts`, `-input.ts`, `-payload.ts`, or `-connection-types.ts`.
- Inputs (`<action>-input.ts`) and payloads (`<action>-payload.ts`) live in `<feature>/types/`; entity response DTOs (`<entity>.dto.ts`) live in `<feature>/dto/`.
- The global `ValidationPipe` uses `whitelist` + `forbidNonWhitelisted`, so **every** input field needs `class-validator` decorators, or requests containing it are rejected. Optional fields use `@IsOptional()` and `?`.
- Input fields are `readonly`, have `@Expose()` and `@ApiProperty({ example })` / `@ApiPropertyOptional`. Normalize strings with the transformers in `auth/utils/transformers.ts` (`trim`, `normalizeEmail`).
- Entity DTOs use `@Exclude()` on the class and `@Expose()` per field, so new entity columns (e.g. `password`) never leak. Nested DTOs need `@Type(() => ...)`. Convert with `plainToInstance(Dto, entity)`; never return entities directly.
- List endpoints return a Relay `Connection<TNode>`; define `<Entity>Node`, `<Entity>Edge`, `<Entity>Connection` in `<feature>/types/<entity>-connection-types.ts`.

## After changing endpoints or request/response shapes

- Run `yarn swagger:generate` to refresh `swagger/openapi.json`.
- Update `postman/nestjs-rest-template.postman_collection.json` to match, then run `yarn postman:sync`.
