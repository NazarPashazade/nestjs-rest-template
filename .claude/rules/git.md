# Git workflow

## Branches

- Commit each new piece of work on its own branch created from an up-to-date `main`, never directly on `main` or on an unrelated feature branch.
- Name branches `<type>/<short-kebab-description>`, where type is `feature`, `fix`, `refactor`, `chore` or `docs` (e.g. `feature/password-reset`, `fix/login-throttle`).
- If the current branch already holds the same work, keep committing there instead of creating another one.
- Create branches with `git checkout --no-track -b <branch> origin/main` so the new branch doesn't track `main`.

## Publishing

- Push after every commit. A branch that doesn't exist on `origin` yet is published with `git push -u origin <branch>`; an already published branch is pushed with `git push`.
- Never push to `main` and never force-push unless explicitly asked.

## Commit messages

- Subject: imperative mood, capitalized, no trailing period, about 72 characters max (e.g. `Add forgot/reset password flow and Postman sync script`).
- For anything beyond a trivial change, add a body after a blank line explaining what changed and why: new endpoints, migrations, env vars, and breaking changes.
- Keep one logical change per commit; don't mix unrelated changes.

## Pull requests

- After the first push of a branch, open a pull request into `main` with `gh pr create --base main`. If the branch already has an open PR, later pushes update it; don't create another.
- Never merge pull requests (no `gh pr merge`, no merging into `main` locally); merging is done by the user.
- Title follows the commit subject style. The description covers a summary of the change, notable details (migrations, new env vars, API changes) and how it was tested.

## Attribution

- Don't mention Claude, Claude Code or AI anywhere in commit messages or PR descriptions: no `Co-Authored-By: Claude` trailer and no "Generated with Claude Code" line.
