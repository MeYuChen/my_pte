# Implementation Tasks

## 1. Data Model

- [ ] Define a `StudyProject` shape.
- [ ] Wrap the existing `window.WE_DATA` as the default demo project.
- [ ] Define imported essay IDs so they cannot collide with demo article IDs.
- [ ] Define localStorage keys for custom projects and imported essays.

## 2. Import Flow

- [ ] Add an import entry point in the UI.
- [ ] Allow input of project name.
- [ ] Allow input of template paragraphs.
- [ ] Allow input of essay title, topic, position, and full essay text.
- [ ] Validate that the essay has four paragraphs.
- [ ] Normalize whitespace and paragraph breaks.

## 3. Slot Extraction

- [ ] Reuse existing `ARTICLE_SLOT_PATTERNS` for default-template essays.
- [ ] Surface extraction failures as editable fallback fields.
- [ ] Preserve manually edited extracted slots.
- [ ] Avoid silently accepting empty or low-quality extraction output.

## 4. Practice Compatibility

- [ ] Merge demo articles and imported articles in the article list.
- [ ] Reuse existing article fill-in practice for imported essays.
- [ ] Store drafts and progress by project ID plus essay ID.
- [ ] Keep existing demo progress readable.

## 5. Persistence

- [ ] Save imported projects locally.
- [ ] Load imported projects on startup.
- [ ] Add basic delete/export capability for user data.

## 6. Documentation and Release

- [ ] Update `README.md` when import flow exists.
- [ ] Update `AI_HANDOFF.md` with the new architecture.
- [ ] Update `CHANGELOG.md` for every merged change.
- [ ] Do not merge to `master` without explicit approval.
