# Changelog

All notable changes to this project are recorded here.

## 2026-10-05 Published

- Published the user-approved PDF integration to master.
- Add explicit versions to CSS/scripts and service-worker registration to prevent mixed old/new assets during deployment; static cache v24; version memory-card URLs and image cache v8 to invalidate previously cached card images.

## Unreleased

- Publish Reading learning flow: organize 44 fine-grained points into 12 learner courses, add route and point recognition practice, scope point-specific scoring, show full sentence examples and boundary cases, and add 22 labeled transfer variants for low-frequency points.
- Add a standalone Reading module with 44 audited knowledge points and four linked views: concept, method, tips and practice.
- Replace audit-style Reading notes across all 44 knowledge points with memorable learner rules; add two quick-recognition cues to each of the 42 standard guides and retain hand-curated clue-driven examples for S02/C08.
- Add 54 representative Reading questions (295 blanks), per-question timing, blank-level grading and wrong-answer knowledge-point tracing; keep submitted explanations persistently below the passage instead of in a dismissible modal, and make every primary/related point chip expandable with a link to the full method page, preserve a return path to the original graded question, and highlight every point involved in the current wrong-answer set.
- Separate answer reasons from knowledge-point classification in the inline review area; replace audit boilerplate with reviewed explanations for all 295 representative blanks across all 54 questions, including corrected decisive-point mappings and explicit ambiguity notes where grammar alone is not exclusive.
- Preserve original RW options; present R questions as a per-question answer pool without inventing unavailable institutional distractors or requiring typed input.
- Re-render all 39 Part A cards at 2046 × 1904 pixels (lossless PNG), increase card display contrast and bump image cache to v7/static cache to v22.
- Replace Chinese route lists with the full one-sentence mnemonic in the learning panel and recall cards.

### PDF integration (acceptance branch)
- Integrate PDF locked v3 into the existing master application: update 33 essay bodies, practice modules, exam answers and corresponding Chinese translations; leave six unchanged essays and the extra #101010 intact.
- Replace old overlapping categories and round filters with the PDF's seven exclusive categories across catalog, recall, essay and exam views.
- Replace 39 existing memory images with cropped Part A cards, and synchronize hooks, routes, English anchors and updated skeletons.
- Remove the pet UI, event handlers and tracking logic; preserve practice progress, drafts, WFD and timer settings.
- Remove the standalone WE preview folder from this branch. Master deployment requires user approval after preview.
- Bump static cache to v21 and image cache to v6; add content consistency checks and update browser acceptance tests.

### Added
- Added a mobile-friendly card drilling mode with route, keyword, skeleton, and mixed recall cards.
- Added local drill grading with three outcomes: forgot, vague, and known.
- Added `learning-paths.js` with 39 article-level memorization paths: Chinese route, Chinese hook, five English keywords, and four English skeleton sentences.
- Added a layered memorization panel for article, memory, and exam contexts so students can move from compressed prompts to full essay practice.
- Replaced and rotated #106 Effective Study memory card with the fixed v8 image and bumped cache versions.
- Replaced 15 corrected memory cards from `WE_problematic_15_cards_final_replacements` and bumped image cache versions.
- Added reviewed Chinese translations for all 39 WE articles and highlighted Chinese core phrases in the article preview.
- Replaced all 39 memory card images with the approved v5 PRER chain cards.
- Added unified memory-category filtering for article argument, memory, and exam modes.
- Added memory logic display to article argument and exam modes.
- Added a structured Chinese translation/highlight slot for reviewed translations.
- Added image-based `memory` mode on `master_hot_dev` for fast WE card review.
- Added 39 memory card images under `images/memory-cards/`.
- Added memory-only filters for rounds, mother-logic categories, and balanced topics.
- Added memory-mode mother logic, Chinese hook, and writing logic prompts above the card image.
- Added `AI_HANDOFF.md` to help future AI/developers quickly understand project context.
- Added fullscreen image navigation with previous/next controls.
- Added keyboard navigation in fullscreen image view with Left/Right arrows.
- Added fullscreen image zoom with mouse wheel.
- Added fullscreen image pan with left-button drag.
- Added background image caching after opening the site to make fullscreen image navigation faster on GitHub Pages.
- Added a Service Worker cache so previously loaded images can be reused across refreshes and later visits.

### Changed
- Moved the original essay preview above the memory card in article argument mode and aligned image collapse styling with the essay preview panel.
- Updated article argument card images to use full-width auto height so the whole memory card is visible without cropping or internal scrolling.
- Updated article argument mode to reuse memory card images, show memory range filters, and add a read-only original essay panel with core sentence highlights before practice.
- Reworked the sidebar collapse control into a single toggle button.
- Improved sidebar toggle positioning so the main content no longer gets extra top spacing.
- Fullscreen image view now fits the image within the viewport before manual zooming.
