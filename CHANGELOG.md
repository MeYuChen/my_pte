# Changelog

All notable changes to this project are recorded here.

## Unreleased

### Added
- Updated article argument mode to reuse memory card images, show memory range filters, and add a read-only original essay panel with core sentence highlights before practice.- Added image-based `memory` mode on `master_hot_dev` for fast WE card review.
- Added 39 memory card images under `images/memory-cards/`.
- Added memory-only filters for rounds, mother-logic categories, and balanced topics.
- Added memory-mode mother logic, Chinese hook, and writing logic prompts above the card image.- Added `AI_HANDOFF.md` to help future AI/developers quickly understand project context.
- Added fullscreen image navigation with previous/next controls.
- Added keyboard navigation in fullscreen image view with Left/Right arrows.
- Added fullscreen image zoom with mouse wheel.
- Added fullscreen image pan with left-button drag.
- Added background image caching after opening the site to make fullscreen image navigation faster on GitHub Pages.
- Added a Service Worker cache so previously loaded images can be reused across refreshes and later visits.

### Changed
- Reworked the sidebar collapse control into a single toggle button.
- Improved sidebar toggle positioning so the main content no longer gets extra top spacing.
- Fullscreen image view now fits the image within the viewport before manual zooming.
