---
paths:
    - 'src/modules/auth/**/*.ts'
---

# Auth module

- `JwtStrategy` reads a Bearer token signed with `JWT_SECRET`; `CustomAuthGuard` enforces roles from `'roles'` metadata against `JwtPayload.role`.
- `{ resolveNullIfUnauthorized: true }` on the authorize decorators swaps the guard for `EmptyIfUnauthorizedInterceptor`, which returns `null` instead of throwing 401/403.
- Email-verification and password-reset tokens are JWTs signed with the same `JWT_SECRET` and carry a `purpose` claim (`TokenPurpose` in `auth.service.ts`). Access-token validation rejects any payload with `purpose` or without `id`; keep both checks when adding token types, and give every new token type its own `purpose`.
- Password-reset tokens also carry `passwordFingerprint` (`utils/password.ts`); `verifyPasswordResetTokenAsync` compares it with the user's current hash, which makes reset links single-use without a DB table. Keep this when touching the reset flow.
- Registration (`RegisterHandler`, `@Transactional`) creates the user **and** `UserDetails`; login requires `details`, so any other user-creation path (seeders, admin endpoints) must create both.
- Login requires `emailVerified`. Error messages must not reveal whether an email is registered.
- Never log tokens, passwords or hashes.
