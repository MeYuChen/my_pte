# Implementation Tasks

## 1. Data Model

- [ ] Define a `StudyProject` shape.
- [ ] Wrap the existing `window.WE_DATA` as the default demo project.
- [x] Define imported essay IDs so they cannot collide with demo article IDs.
- [x] Define localStorage keys for custom projects and imported essays.

## 2. Import Flow

- [x] Add an import entry point in the UI.
- [ ] Allow input of project name.
- [x] Allow input of template paragraphs.
- [x] Allow input of essay text under a selected high-frequency topic.
- [x] Validate that the essay has four paragraphs.
- [x] Normalize whitespace and paragraph breaks.

## 3. Slot Extraction

- [x] Reuse existing `ARTICLE_SLOT_PATTERNS` for default-template essays.
- [x] Surface extraction failures as editable fallback fields.
- [x] Match custom templates with `()` placeholders against imported essays.
- [x] Report template sentence mismatches instead of silently accepting bad imports.
- [x] Add a review step before saving matched imports.
- [x] Let users confirm or manually enter the imported essay position.
- [x] Warn when a pasted template differs from the saved global template and require a scope choice.
- [ ] Preserve manually edited extracted slots.
- [x] Avoid silently accepting empty or low-quality extraction output.

## 4. Practice Compatibility

- [x] Merge demo articles and imported articles in the article list.
- [x] Reuse existing article fill-in practice for imported essays.
- [ ] Store drafts and progress by project ID plus essay ID.
- [ ] Keep existing demo progress readable.

## 5. Persistence

- [x] Save imported projects locally.
- [x] Load imported projects on startup.
- [ ] Add basic delete/export capability for user data.

## 6. Documentation and Release

- [ ] Update `README.md` when import flow exists.
- [ ] Update `AI_HANDOFF.md` with the new architecture.
- [x] Update `CHANGELOG.md` for every merged change.
- [ ] Do not merge to `master` without explicit approval.
