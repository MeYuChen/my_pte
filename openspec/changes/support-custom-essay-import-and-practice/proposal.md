# Change Proposal: Support Custom Essay Import and Practice

## Summary

Add a user-import workflow so learners can bring their own PTE WE template and essay content, then practice imported essays with the existing fill-in, checking, and progress mechanisms.

This changes the product direction from a fixed 39-essay practice site into a personalized study-package generator.

## Problem

The current application is built around static data from `practice-data.js`. This works for the existing 39-essay package, but it does not support the intended commercial/product direction:

- users may already have their own template;
- users may already have their own essays;
- each user's memorization cards, fill-in content, and practice items are personalized;
- paid value may come from content整理, teacher review, and card generation services, not only from a fixed dataset.

## Goals

- Allow users to create or select a local study project.
- Allow users to import a PTE WE template.
- Allow users to import at least one complete essay with title, topic, position, and paragraphs.
- Extract practice slots from imported essays using existing template-compatible rules.
- Make imported essays available in the existing article practice flow.
- Preserve the current 39-essay package as a demo/default project.
- Store imported project data locally in the browser for the first version.

## Non-Goals

This change does not implement:

- accounts or cloud sync;
- payment;
- server-side storage;
- AI generation;
- teacher review workflow;
- PNG/PDF card export;
- mobile app packaging;
- rewriting the app with a frontend framework.

## Proposed Approach

Implement this in incremental steps:

1. Introduce a `StudyProject` data shape while adapting the existing `WE_DATA` as the default demo project.
2. Add local persistence for user-created projects.
3. Add an import UI for template and essay content.
4. Convert imported essays into the same internal shape currently used by article practice.
5. Reuse existing practice, grading, and progress logic wherever possible.

## Risks

- Template extraction may fail for user essays that do not closely follow the template.
- Imported data can break existing practice assumptions if not normalized.
- Existing localStorage progress may need migration when multiple projects are introduced.
- Too much architecture change at once could destabilize the current production workflow.

## Rollout

Develop on `develop`. Keep `master` stable until the import flow is tested manually and approved.

The first useful milestone is:

> A user can import one custom essay and practice it like an existing article.
