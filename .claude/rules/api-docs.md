---
paths:
    - 'src/modules/**/controllers/**/*.ts'
    - 'src/modules/**/dto/**/*.ts'
    - 'src/modules/**/types/**/*.ts'
    - 'src/modules/auth/decorators/**/*.ts'
    - 'src/main.ts'
    - 'src/swagger.ts'
    - 'swagger/**'
    - 'postman/**'
---

# Keeping Swagger and Postman in sync

Any change to the API contract must update both `swagger/openapi.json` and `postman/nestjs-rest-template.postman_collection.json` in the same change. The contract covers routes, HTTP methods, path/query/body parameters, validation rules, response shapes, status codes and auth requirements. Internal refactors that leave the contract unchanged need neither.

## Swagger

- Regenerate with `yarn swagger:generate` (no database needed). Never edit `openapi.json` by hand.
- Check the diff: only the endpoints and schemas you meant to change should move.

## Postman

- Add, update or remove requests so the collection matches the controllers: same paths, methods, bodies and auth. New endpoints go in their feature's folder.
- Every request has a test script that checks the status code and the key parts of the response.
- New endpoints also get their main failure cases: invalid input (400), missing token (401) and not found or conflict where they apply.
- Use collection variables for ids, slugs and tokens; never hard-code them or real secrets. A request that sets a variable runs before the requests that use it, so the whole collection works in the Collection Runner.
- Requests that create data delete it again at the end of their folder.
- Mention new variables or run-order dependencies in the collection description.

## Before finishing

- Start the API and run the collection with newman: `npx newman run postman/nestjs-rest-template.postman_collection.json --folder <Folder> ...`. All assertions must pass. Leave out the Registration and Password reset folders when SMTP is configured, since they send real emails.
- Then run `yarn postman:sync` (see `postman.md`).
