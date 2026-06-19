# Project Spec Guidelines

## Product Direction

`my_pte` is evolving from a fixed PTE WE memorization tool into a custom study-package generator.

The stable product must continue to support the current 39-essay demo package while adding a path for users to import their own WE templates and essays.

## Branch Policy

- `master` is the production branch used by GitHub Pages.
- `develop` is the integration branch for active development.
- Do not merge into `master` without explicit user approval.
- Every product or architecture change must update `CHANGELOG.md`.

## Change Proposal Rules

Use `openspec/changes/<change-id>/` for non-trivial changes.

Each change should include:

- `proposal.md`: problem, goals, scope, non-goals, risks.
- `tasks.md`: implementation checklist.
- `specs/<capability>/spec.md`: requirements and scenarios.

Keep proposals narrow enough to implement and validate independently.
