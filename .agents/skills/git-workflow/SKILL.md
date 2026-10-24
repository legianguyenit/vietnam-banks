---
name: git-workflow
description: Enforces a safe Git workflow for coding tasks, including mandatory branch creation before new code, standardized branch naming, validation, conventional commits, and safe push/pull request practices.
---

# Git Workflow Skill

This skill enforces a professional, safe, and controlled Git workflow optimized for AI-assisted ("vibe") coding. Every AI agent working on code modifications within this workspace MUST strictly adhere to these rules.

---

## CORE RULES

### RULE #1 — MANDATORY BRANCH CREATION BEFORE CODING

**NEVER write, edit, or generate new code directly on `main` or `master`.**

Before starting ANY coding task (new feature, bug fix, refactor, dependency update, configuration change), the agent MUST:

1. Inspect Git status: `git status`
2. Determine current branch: `git branch --show-current`
3. Inspect working tree and remote status: `git remote -v`
4. Identify default branch (`main` or `master`).
5. **If currently on `main` or `master`**:
   - DO NOT edit code immediately.
   - MUST create a new feature/fix branch first: `git switch -c <type>/<short-description>`
6. Confirm branch switch: `git branch --show-current`
7. **Only after successfully switching to a valid branch is code modification allowed.**

---

## BRANCH NAMING CONVENTION

All branch names MUST follow the format:

```text
<type>/<short-description>
```

### Allowed Branch Types

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality or feature | `feature/add-bank-search` |
| `fix/` | Standard bug fixes | `fix/swift-code-parser` |
| `refactor/` | Code refactoring without changing public behavior | `refactor/bank-data-structure` |
| `docs/` | Documentation updates | `docs/update-readme` |
| `test/` | Adding or updating tests | `test/bank-validation` |
| `chore/` | Maintenance, configuration, dependencies | `chore/update-dependencies` |
| `perf/` | Performance optimizations | `perf/optimize-bank-search` |
| `build/` | Build scripts or packaging tooling | `build/npm-package` |
| `ci/` | Continuous Integration / CD workflows | `ci/github-actions` |
| `hotfix/` | Production-critical emergency fixes | `hotfix/security-patch` |

### Branch Naming Rules
- MUST be **lowercase**
- MUST use **kebab-case** (hyphens separating words)
- NO spaces, NO accented Vietnamese characters, NO unnecessary special characters
- Short, clear, and descriptive of the actual goal
- NEVER use generic names like `test`, `new`, `update`, `fix`, `abc`, `dev`, `branch1`, `my-branch`
- NEVER use camelCase (`feature/AddBank`), snake_case (`feature/add_bank`), or spaces (`feature/add bank`). Use `feature/add-bank`.

---

## BRANCH CREATION WORKFLOW

For every coding task, the agent MUST execute the following sequence:

```text
1. Inspect repository & architecture
2. Inspect Git status (git status)
3. Inspect current branch (git branch --show-current)
4. Determine task type (feature, fix, refactor, docs, etc.)
5. Generate standardized branch name
6. Create and switch to branch (git switch -c <type>/<short-description>)
7. Verify current branch
8. ONLY THEN modify code
```

- If the branch name can be clearly inferred from the user prompt (e.g. "Add bank search by SWIFT code"), infer `type = feature` and `description = bank-search-swift`, then run `git switch -c feature/bank-search-swift` directly without asking.
- If the task is too ambiguous to determine the branch type, ask the user before creating the branch.

---

## HANDLING EXISTING UNCOMMITTED CHANGES

If `git status` reveals existing uncommitted changes when starting a task:

1. **NEVER silently reset, discard, or stash the user's uncommitted work.**
2. Distinguish between *existing user changes* and *changes created by the current task*.
3. If on `main` with uncommitted user changes:
   - DO NOT run `git reset --hard` or `git clean -fd`.
   - DO NOT discard or overwrite the changes.
   - If switching to a new branch retains the uncommitted changes cleanly (`git switch -c <branch-name>`), do so safely.
   - If there is a risk of collision, notify the user and ask for guidance before proceeding.

---

## SYNC & DESTRUCTIVE COMMAND PROTECTION

- Check remote status with `git fetch origin` if appropriate.
- DO NOT rebase or reset unless strictly necessary.
- **NEVER use destructive commands** like `git reset --hard`, `git clean -fd`, or `git checkout -- .` unless explicitly requested by the user.

---

## CODING WORKFLOW

After branch creation:

```text
Branch Created
     ↓
Understand Requirements
     ↓
Inspect Existing Code & Architecture
     ↓
Formulate Implementation Plan
     ↓
Implement Smallest Correct Incremental Change
     ↓
Run Project Validation
     ↓
Review Git Diff
     ↓
Atomic Commit (Conventional Commit)
     ↓
Push Branch
     ↓
Create / Update Pull Request
```

- Prioritize small, incremental, focused changes.
- Avoid refactoring code outside the task scope.

---

## VALIDATION BEFORE COMMIT

Before staging and committing, the agent MUST run available validation scripts defined in `package.json` (or project equivalent):

1. Check project scripts first (e.g. read `package.json`).
2. Run applicable validation commands:
   - `npm run lint` (if available)
   - `npm run typecheck` (if available)
   - `npm test` (if available)
   - `npm run build` (if available)
3. **If any validation fails**:
   - DO NOT commit broken code or claim the task is complete.
   - Analyze error logs, fix the root cause, re-run validation.

---

## BEFORE COMMIT CHECKLIST & SAFE STAGING

Before committing, run:
```bash
git status
git diff
git diff --stat
```

### Review Checklist
1. Are there files outside task scope?
2. Are there any secrets, API keys, tokens, or passwords?
3. Is `.env` or `.env.local` accidentally tracked/staged?
4. Are temporary/generated build artifacts present?
5. Is there leftover debug code or unnecessary `console.log` statements?
6. Are there unresolved `TODO` / `FIXME` comments added during this task?

### Staging Rules
- **NEVER blindly run `git add .`** if untracked secret files or irrelevant changes exist.
- Explicitly stage relevant files: `git add <file1> <file2>`
- Verify staged diff before committing: `git diff --cached`

---

## COMMIT CONVENTION (CONVENTIONAL COMMITS)

Every commit message MUST follow the **Conventional Commits** standard:

```text
<type>(<scope>): <description>
```

### Primary Commit Types
- `feat`: A new feature
- `fix`: A bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only changes
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, auxiliary tools, dependencies
- `perf`: A code change that improves performance
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)

### Commit Rules
- Short, concise, imperative present tense ("add", not "added" or "adds")
- Written in English
- Clear and descriptive
- NEVER use generic messages (`update`, `fix bug`, `changes`, `done`, `final`, `test`, `abc`, `update code`).

---

## ATOMIC COMMITS

- Each commit MUST represent **one single logical change**.
- Do not combine unrelated modifications (e.g. adding a search feature + updating unrelated dependencies + rewriting README) into a single commit.
- Split independent work into separate atomic commits.

---

## PUSH WORKFLOW

- Always verify current branch before pushing: `git branch --show-current`
- **NEVER push directly to `main` or `master`.**
- First push of a new branch: `git push -u origin <branch-name>`
- Subsequent pushes: `git push`
- **NEVER force push (`git push --force` / `git push -f`)** unless explicitly requested by the user after assessing all risks.

---

## PULL REQUEST WORKFLOW

After pushing:
- PR title MUST follow Conventional Commit format: `feat(bank): add SWIFT bank search`
- PR description MUST include:
  ```markdown
  ## Summary
  - Short overview of changes

  ## Changes
  - Detailed list of modifications

  ## Validation
  - Verification steps performed (e.g., build, typecheck, tests)

  ## Breaking Changes
  - None (or list breaking changes)
  ```
- DO NOT merge PRs automatically unless explicitly directed by the user.

---

## MAIN BRANCH PROTECTION

`main` and `master` are strictly protected branches.

```text
DO NOT CODE DIRECTLY ON MAIN
DO NOT COMMIT DIRECTLY TO MAIN
DO NOT PUSH DIRECTLY TO MAIN
```

---

## AGENT RESPONSE FORMAT

When starting a coding task, briefly notify the user:

```text
Task: <Short task description>
Type: <feature | fix | refactor | docs | etc.>
Branch: <type>/<short-description>

Creating branch before implementation...
```

Upon completing the task:

```text
Implemented:
- <Summary of changes>

Validation:
- <Status of typecheck / build / tests>

Commit:
<type>(<scope>): <description>

Branch:
<branch-name>
```

If code is changed but not yet committed:

```text
Validation:
- <Status of validation>

Commit:
Not created yet.
```

---

## NON-NEGOTIABLE RULES SUMMARY

1. **Never write new code directly on `main`/`master`.**
2. **Always create or switch to an appropriate branch before implementation.**
3. **Always use standardized branch naming (`type/kebab-case-description`).**
4. **Always inspect Git status before modifying code.**
5. **Never discard user changes without explicit permission.**
6. **Never commit secrets or credential files.**
7. **Always review diff (`git diff --cached`) before committing.**
8. **Always use Conventional Commits.**
9. **Never force-push unless explicitly requested.**
10. **Never use destructive Git commands casually (`reset --hard`, `clean -fd`).**
11. **Validate code (`typecheck`, `build`, `test`) before declaring completion.**
12. **Keep commits atomic and logically scoped.**
