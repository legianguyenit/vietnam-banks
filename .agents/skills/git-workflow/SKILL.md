---
name: git-workflow
description: Enforces a safe Git workflow for coding tasks, including mandatory branch creation before new code, standardized branch naming, validation, conventional commits, and a fully automated commit-push-merge-sync cycle via /commit.
---

# Git Workflow Skill — vietnam-banks

This skill enforces a professional, safe, and controlled Git workflow for the **vietnam-banks** TypeScript library. Every AI agent working on code modifications within this workspace MUST strictly adhere to these rules.

---

## PART 1 — PRE-CODING: BRANCH SAFETY

### RULE #1 — MANDATORY BRANCH CREATION BEFORE CODING

**NEVER write, edit, or generate new code directly on `main` or `master`.**

Before starting ANY coding task (new feature, bug fix, refactor, dependency update, configuration change), the agent MUST:

1. Inspect Git status: `git status`
2. Determine current branch: `git branch --show-current`
3. Inspect remote: `git remote -v`
4. Identify default branch (`main` or `master`).
5. **If currently on `main` or `master`**:
   - DO NOT edit code immediately.
   - MUST create a new branch first: `git switch -c <type>/<short-description>`
6. Confirm branch switch: `git branch --show-current`
7. **Only after successfully switching to a valid branch is code modification allowed.**

---

## BRANCH NAMING CONVENTION

All branch names MUST follow the format:

```text
<type>/<short-description>
```

### Allowed Branch Types — vietnam-banks Context

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality | `feature/add-bank-search` |
| `fix/` | Bug fixes | `fix/swift-code-parser` |
| `refactor/` | Code restructure (no behavior change) | `refactor/bank-data-structure` |
| `docs/` | Documentation updates | `docs/update-readme` |
| `test/` | Adding or updating tests | `test/bank-validation` |
| `chore/` | Maintenance, config, dependencies | `chore/update-dependencies` |
| `perf/` | Performance optimizations | `perf/optimize-bank-search` |
| `build/` | Build scripts or packaging | `build/tsup-config` |
| `ci/` | CI/CD workflows | `ci/github-actions` |
| `hotfix/` | Production-critical emergency fixes | `hotfix/security-patch` |

### Branch Naming Rules
- MUST be **lowercase**
- MUST use **kebab-case** (hyphens separating words)
- NO spaces, NO accented characters, NO special characters
- Short, clear, and descriptive
- NEVER use generic names like `test`, `new`, `update`, `fix`, `abc`, `dev`
- NEVER use camelCase, snake_case, or spaces. Use `feature/add-bank`.

---

## HANDLING UNCOMMITTED CHANGES

If `git status` reveals existing uncommitted changes when starting a task:

1. **NEVER silently reset, discard, or stash the user's uncommitted work.**
2. If on `main` with uncommitted user changes, switch to a new branch safely: `git switch -c <branch-name>` (Git will carry the changes over).
3. If there is a risk of collision, notify the user and ask for guidance before proceeding.

---

## CODING WORKFLOW

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
Push Branch → PR / merge
```

---

## VALIDATION BEFORE COMMIT

Before committing, run the validation scripts defined in `package.json`:

```bash
npm run build        # TypeScript compile via tsup (REQUIRED)
npm run typecheck    # tsc --noEmit (if available)
npm test             # tests (if available)
```

**If any validation fails**: DO NOT commit. Fix the root cause first.

---

## SAFE STAGING CHECKLIST

Before staging and committing, run:

```bash
git status
git diff
git diff --stat
```

Check:
1. Files outside task scope?
2. Secrets, API keys, tokens, passwords?
3. `.env` or `.env.local` accidentally tracked?
4. Temporary / build artifacts (`dist/`)?
5. Leftover debug code or unnecessary `console.log`?
6. Unresolved `TODO` / `FIXME` added during this task?

### Staging Rules
- **NEVER blindly run `git add .`** if untracked secret files or irrelevant changes exist.
- Explicitly stage relevant files: `git add <file1> <file2>`
- Verify staged diff before committing: `git diff --cached`

---

## PART 2 — COMMIT AUTOMATION (`/commit`)

> [!IMPORTANT]
> When the user runs `/commit`, the agent MUST execute ALL 4 steps sequentially and automatically, without stopping or asking the user to do anything manually. The workflow is complete only when back on `main` with a clean workspace.

---

### Step 1 — Analyze & Group Changes

```bash
git status
git diff --cached
git diff
```

If changes span multiple concerns, **DO NOT put them all in one commit**. Group by logical unit — each group gets its own commit.

---

### Step 2 — Commit & Push to Feature Branch

```bash
# Run validation first
npm run build

# Stage and commit each logical group
git add <files-group-1>
git commit -m "feat(scope): description"

git add <files-group-2>
git commit -m "style(scope): description"

git push origin <feature-branch>
```

---

### Step 3 — Merge Feature Branch into `main`

> [!CAUTION]
> DO NOT SKIP THIS STEP. Agent MUST auto-merge after push — never ask the user to merge via GitHub UI.

```bash
git checkout main
git pull origin main
git merge <feature-branch>
git push origin main
```

---

### Step 4 — Cleanup & Sync

```bash
git branch -d <feature-branch>               # delete local branch
git push origin --delete <feature-branch>    # delete remote branch
git branch --show-current                    # confirm: should be main
git status                                   # confirm: clean workspace
```

---

## COMMIT CONVENTION (CONVENTIONAL COMMITS)

Every commit MUST follow:

```text
<type>(<scope>): <short description>
```

### Types for vietnam-banks

| Type | When | Example |
|---|---|---|
| `feat` | New data, API, or feature | `feat(banks): add Agribank SWIFT codes` |
| `fix` | Bug fix | `fix(parser): handle missing bin field` |
| `refactor` | Code restructure (no feature/bug) | `refactor(types): extract BankInfo interface` |
| `docs` | README, JSDoc, comments | `docs(readme): add usage examples for lookup` |
| `test` | Tests | `test(banks): add validation for VCB data` |
| `chore` | Dependencies, build config | `chore(deps): upgrade tsup to v8` |
| `perf` | Performance improvement | `perf(search): index banks by bin for O(1) lookup` |
| `build` | Build system changes | `build(tsup): enable dts generation` |
| `ci` | CI/CD changes | `ci(actions): add typecheck step` |
| `style` | Formatting, whitespace (no logic change) | `style(data): normalize bank name casing` |

### Scope Names — vietnam-banks

`banks` · `data` · `types` · `parser` · `search` · `build` · `deps` · `docs` · `ci` · `tests` · `exports`

### Description Rules
- Present tense, imperative: `add`, `fix`, `update`, `remove` — NOT `added`, `fixed`
- Lowercase first letter after colon
- No period at end
- Max 50 characters for the subject line
- Written in English

---

## ATOMIC COMMITS

- Each commit MUST represent **one single logical change**.
- Do not combine unrelated modifications into a single commit.
- Split independent work into separate atomic commits.

---

## PUSH RULES

- Always verify current branch before pushing: `git branch --show-current`
- **NEVER push directly to `main` or `master`.**
- First push of a new branch: `git push -u origin <branch-name>`
- Subsequent pushes: `git push`
- **NEVER force push** unless explicitly requested by the user after assessing all risks.

---

## PULL REQUEST FORMAT

After pushing, create a PR with:

**Title:** `feat(banks): add Agribank SWIFT codes` *(follows Conventional Commit format)*

**Description:**

```markdown
## Summary
- Short overview of changes

## Changes
- Detailed list of modifications

## Validation
- `npm run build` — ✅ passed
- `npm run typecheck` — ✅ passed

## Breaking Changes
- None (or list breaking changes)
```

---

## MAIN BRANCH PROTECTION

```text
DO NOT CODE DIRECTLY ON MAIN
DO NOT COMMIT DIRECTLY TO MAIN
DO NOT PUSH DIRECTLY TO MAIN
```

---

## AGENT RESPONSE FORMAT

**When starting a coding task:**

```text
Task: <Short task description>
Type: <feature | fix | refactor | docs | etc.>
Branch: <type>/<short-description>

Creating branch before implementation...
```

**Upon completing a task:**

```text
Implemented:
- <Summary of changes>

Validation:
- npm run build — ✅ passed

Commit:
<type>(<scope>): <description>

Branch:
<branch-name>
```

---

## EXAMPLE COMMIT SEQUENCE — vietnam-banks

```bash
# Group 1: dependency change
git add package.json package-lock.json
git commit -m "chore(deps): upgrade tsup to v8"

# Group 2: new bank data
git add src/data/agribank.ts
git commit -m "feat(banks): add complete Agribank branch data"

# Group 3: type improvements
git add src/types.ts src/index.ts
git commit -m "refactor(types): extract BankInfo and BranchInfo interfaces"

# Group 4: docs
git add README.md
git commit -m "docs(readme): add lookup usage examples"

# Push, merge, cleanup
git push origin feature/add-agribank-data
git checkout main
git pull origin main
git merge feature/add-agribank-data
git push origin main
git branch -d feature/add-agribank-data
git push origin --delete feature/add-agribank-data
```

---

## DEFINITION OF DONE (`/commit`)

- [ ] All changes committed in logical groups with Conventional Commits messages
- [ ] `npm run build` passes before each commit
- [ ] Feature branch pushed to remote origin
- [ ] Feature branch **merged** into `main`
- [ ] `main` **pushed** to remote after merge
- [ ] Local feature branch **deleted**
- [ ] Agent is back on `main` with latest code, workspace clean

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
11. **Validate (`npm run build`) before declaring completion.**
12. **Keep commits atomic and logically scoped.**
13. **`/commit` MUST auto-complete all 4 steps — push, merge, cleanup — without stopping.**
