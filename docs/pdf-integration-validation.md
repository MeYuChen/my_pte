# PDF integration acceptance

Branch: `feature/pdf-we-integration`, based on master `765567b`.

## Scope

The existing application, modes, article IDs and saved practice state are preserved. The old standalone `preview/we-study/` is removed on this branch.

33 PDF essays have updated English bodies, matching Chinese translations, practice modules and exam answers. Unchanged bodies/translations: #77, #86, #106, #124, #170, #46. The extra existing #101010 is preserved.

All 39 Part A cards and their hooks, routes and English anchors are integrated in the original memory and layered recall panels. PDF navigation labels and page furniture are cropped from the card images. Old categories are replaced by the seven PDF categories. Pet UI and its tracking/calendar runtime are removed.

## Validation

- `node tests/content-consistency.cjs`: passed for all 40 retained essays, four paragraphs/modules each, Chinese translations, learning paths and seven exclusive categories.
- Compared all 39 bodies with the extracted PDF locked v3 source: exact paragraph matches. The six unchanged articles, their translations and the extra article are semantically identical to master.
- Syntax checks passed for app, data, translations, learning paths, service worker and browser test files.
- Live browser: seven memory categories contain 7 / 4 / 4 / 6 / 8 / 5 / 5 cards; catalog selection correctly opens #163; English has four rows and toggling Chinese adds four translation rows.
- Live browser: updated #163 essay receives a full match in exam mode; card recall and WFD checking remain functional; memory image loads and the pet is absent.
- Playwright acceptance cases were updated for the seven categories and removed pet. The complete desktop/mobile automated suite was not run in this execution environment because its configured Chrome executable is unavailable; the interaction checks above used the cloud browser.

## Release gate

Do not merge or deploy to master until the user has reviewed the branch preview and explicitly approves publication.
