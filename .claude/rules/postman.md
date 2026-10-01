---
paths:
    - 'postman/**'
    - 'scripts/postman-sync.js'
---

# Postman collection

- After editing `postman/nestjs-rest-template.postman_collection.json`, run `yarn postman:sync` to replace the collection in the Postman workspace. It needs `POSTMAN_API_KEY` in the environment; never print or commit the key.
- The sync overwrites edits made directly in the Postman app, so ask before syncing if the user says they changed the collection there.
- What the collection must contain and how to test it is in `api-docs.md`.
