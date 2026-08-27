# PRD Terminology, Structure, and Rules

**Purpose:** This is the reference document for how the AINN PRD is organized, what terms mean, and how coding agents should interact with it. Read this before doing anything in `docs/prd/`.

---

## How the PRD is Structured

```
docs/prd/
  INDEX.md              — Feature index with statuses (start here for orientation)
  decisions.md          — Product and architecture decisions log
  guides/               — Procedural guides for coding agents (you are here)
  features/             — One file per feature (the detailed record)
  architecture/         — Technical architecture docs (how things are built)
  reference/            — Brand messaging and supplementary reference material
```

### Finding what you need

1. Read `INDEX.md` to see all features and their current status
2. Open the relevant `features/*.md` file for the feature you're working on
3. That file contains: objective, current state (functionality statuses), architecture, history, and known issues
4. If you need procedural guidance, check `guides/`

### Rules for modifying PRD files

1. **Never create a new file in `docs/prd/` without Adam's approval.** Ask first.
2. **Never remove content from a PRD file.** Add to it, update statuses, correct errors — but don't delete history or context.
3. **When you touch a feature file that uses old/inconsistent terminology,** update it to conform to this document at the same time.
4. **If you are unsure about the status of a feature or functionality, ask Adam.** Do not guess or infer from code alone.

---

## Hierarchy

The platform is described at three levels:

| Level | Term | Definition | Example |
|-------|------|------------|---------|
| 1 | **Feature** | A top-level area of the site that serves a major function. One feature = one PRD file in `docs/prd/features/`. | Articles, Homepage, Model Widget, Membership |
| 2 | **Functionality** | A discrete capability within a feature. A single action or interaction a user can perform. One feature contains multiple functionalities. | Verification marks, The Record panel, share row, follow-story email, ask-the-article suggested questions |
| 3 | **Step** | A single user action within a functionality's flow. Steps only appear in user-facing documentation. | "Click Copy link", "Enter email to follow" |

Additional terms:

| Term | Definition | Example |
|------|------------|---------|
| **Pipeline** | An automated backend process that spans multiple features. Documented in architecture. | Content pipeline (monitor → generate → review → publish → distribute) |
| **Objective** | What a functionality is supposed to do when complete. | "Allow readers to ask AI questions grounded only in the current article" |
| **Issue** | A known problem with a live functionality. Either a bug or a UX problem. | "Share row wraps awkwardly on 375px screens" |

### Hierarchy rules

- A **feature** is never a single button or interaction. If it's smaller than a distinct user-facing area, it's a functionality.
- A **functionality** is always owned by exactly one feature.
- **Steps** only appear in user-facing documentation. They are not tracked in the PRD.
- Every **functionality** has both a status and an objective. The objective is written even if the status is "live."

---

## Statuses

Every feature and every functionality has exactly one status at any point in time.

| Status | Meaning | Visible to users? | In PRD? |
|--------|---------|-------------------|---------|
| **live** | Deployed and accessible to readers | Yes | Yes |
| **in-development** | Actively being built. Not accessible to readers. | No | Yes |
| **planned** | Designed or specified but no code written yet | No | Yes |
| **paused** | Was in development, work has stopped. May resume later. | No | Yes |
| **withdrawn** | Was live, has been intentionally removed | No | Yes (with reason) |

### Feature-level status

A feature's overall status is determined by its functionalities:
- If at least one functionality is live → the feature is **live**
- If no functionalities are live → the feature takes the status of its most advanced functionality

### Status transitions

| From | To | What must happen |
|------|----|-----------------|
| in-development → **live** | Update PRD status table |
| live → **withdrawn** | Update PRD status table (include reason) |
| Any → **paused** | Update PRD status table. Note why. |

---

## Issues

Issues are tracked per-functionality in the PRD feature file. They describe problems with **live** functionalities only.

### Issue types

| Type | Definition |
|------|------------|
| **bug** | Does not work as intended |
| **ux** | Works correctly but the experience is poor |
| **limitation** | Works but is intentionally incomplete |

### Where issues go

In the PRD feature file, under a "Known Issues" section:

```markdown
## Known Issues

| Functionality | Type | Description | Priority |
|---------------|------|-------------|----------|
| Share row | ux | Wraps on very narrow viewports | low |
```

---

## PRD Feature File Template

Each file in `docs/prd/features/` should conform to this structure:

```markdown
# Feature: [Name]

**Status:** [live / in-development / planned / paused / withdrawn]
**Last updated:** [date]
**Depends on:** [other features or systems]
**Key files:** [main source files when they exist]

---

## Objective

[What this feature does and why it exists — one paragraph]

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| [name] | live | [what it does] | |
| [name] | planned | [what it will do] | |

## Architecture

[Technical implementation details — for coding agents]

## Known Issues

| Functionality | Type | Description | Priority |
|---------------|------|-------------|----------|
| — | — | — | — |

## History

| Date | Change |
|------|--------|
| [date] | [what changed] |
```

---

## Approved Terminology

### For statuses:
- **live** — not "working", "built", "done", "complete", "shipped", "active"
- **in-development** — not "WIP", "in progress", "being built"
- **planned** — not "design", "specified", "next", "upcoming", "future"
- **paused** — not "on hold", "deferred", "blocked"
- **withdrawn** — not "removed", "hidden", "disabled", "deprecated"

### For hierarchy:
- **feature** — not "module", "system", "area", "section", "page"
- **functionality** — not "sub-feature", "capability", "function"
- **step** — not "action", "instruction", "task" (in documentation context)
- **pipeline** — not "workflow", "process" (for automated multi-feature backend flows)
- **objective** — not "purpose", "goal", "intent"
- **issue** — not "problem", "defect", "ticket"

---

## Quick reference for coding agents

**Starting a task:**
1. Read this document first
2. Check `INDEX.md` to find the relevant feature
3. Read the feature's PRD file to understand current state
4. Read `docs/design/ainn-design-system.md` for visual constraints
5. If unsure about any status, ask Adam

**Finishing a task:**
1. Update the PRD feature file's "Current State" table with correct statuses
2. If you encountered issues → add them to "Known Issues"
3. If the file used old terminology → conform it
