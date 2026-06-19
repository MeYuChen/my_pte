# Changelog

All notable changes to this project are recorded here.

## Unreleased

### Added
- Added immersive memory review with a full-screen card layout, custom per-card countdown, pause/resume, and early next navigation.
- Added a dedicated memory review mode for fast card study with next-article navigation.
- Added an article memory card preview generated from extracted core fields, with editable mnemonic hooks.
- Added strong import auditing with issue cards that highlight problematic template or essay sentences before review generation.
- Added a template conflict warning when an imported article uses a template different from the saved global template.
- Added a review step for template-matched imports so users can confirm or manually enter each essay's Position before saving.
- Added template-based custom essay importing that extracts memorization fields from `()` placeholders.
- Added a local custom essay import flow that saves user essays and makes them practiceable in article mode.
- Added OpenSpec project guidelines and a change proposal for custom essay import and practice.
- Added `AI_HANDOFF.md` to help future AI/developers quickly understand project context.
- Added fullscreen image navigation with previous/next controls.
- Added keyboard navigation in fullscreen image view with Left/Right arrows.
- Added fullscreen image zoom with mouse wheel.
- Added fullscreen image pan with left-button drag.
- Added background image caching after opening the site to make fullscreen image navigation faster on GitHub Pages.
- Added a Service Worker cache so previously loaded images can be reused across refreshes and later visits.

### Changed
- Refined immersive memory card spacing and changed next navigation to a compact arrow control.
- Moved memory review next navigation into the card flow for faster one-handed review.
- Made memory review mode read-only so cards can be browsed quickly without accidental edits.
- Split article study into separate `速记` and `默写` main modes, with custom imports landing on the memory card first.
- Reworked memory cards so the main mind-map nodes are editable Chinese memory hooks, with English core sentences moved below as reference.
- Reworked memory card layout so argument 1 and argument 2 branch in parallel and core fields are listed vertically by paragraph.
- Reworked the sidebar collapse control into a single toggle button.
- Improved sidebar toggle positioning so the main content no longer gets extra top spacing.
- Fullscreen image view now fits the image within the viewport before manual zooming.
