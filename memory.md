# Memory — Setup GitHub CLI (gh)

Last updated: 2026-08-03

## What was built

- Diagnosed `gh` (GitHub CLI) missing on Windows: `where.exe gh` → not found, `winget --version` → v1.29.280 available.
- Installed GitHub CLI via winget (`winget install --id GitHub.cli -e`). Package was already registered — installed binary confirmed at `C:\Program Files\GitHub CLI\gh.exe`.
- No source code changes were made this session.

## Decisions made

- Use the winget installation of GitHub CLI (standard `C:\Program Files\GitHub CLI` location).

## Problems solved

- `gh` not recognized in PowerShell even though the package was installed: the session PATH was stale. Fix is to open a new terminal, or persist the PATH for the user:
  `[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\GitHub CLI", "User")`

## Current state

- `gh` is installed but not yet authenticated — user still needs to run `gh auth login` in a fresh terminal.

## Next session starts with

- Have the user open a new terminal and run `gh auth login` to complete GitHub authentication, if it hasn't been done already.

## Open questions

- None.

## GitHub issues

- There are tickets/issues in the GitHub repo that need to be reviewed. Use `gh issue list` to pull them up and align before starting Phase 1 work.

## Phase 1 — Project Setup & Shared Foundation

- **Ticket 01 — Project & Clean Architecture Foundation**
  - Set up project directory structure (`src/core`, `src/features`, `src/shared`, `src/layouts`, `src/pages`).
  - Configure Tailwind CSS design system with dark mode tokens (`ui-tokens.md`) and Radix UI primitives.
  - Implement base layout (`Navbar`, `Footer`, Theme Provider) with high-aesthetic styling.
  - NOTE: current codebase is React 18 + Vite + CSS Modules — Tailwind/Radix/Navbar/Footer are the target spec, do not introduce them without a migration ticket.
- **Ticket 02 — Database Schema, Prisma & Core Domain Entities**
  - Configure PostgreSQL database & Prisma ORM schemas (`Incident`, `Statistic`, `User`, `AuditLog`).
  - Define core Domain entities and Error classes in `src/core/entities` and `src/core/errors`.
  - Set up Winston backend logging and standardized API error envelope middleware.

Reference: `context/build-plan.md`, `context/progress-tracker.md` (current status: Phase 1, next up Ticket 01).
