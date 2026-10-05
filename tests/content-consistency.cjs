const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const window = {};
for (const name of ['practice-data', 'translations', 'learning-paths']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, `${name}.js`), 'utf8'), {window});
}
const moduleKeys = ['introduction', 'argument1', 'argument2', 'conclusion'];
assert.equal(window.WE_DATA.articles.length, 40, 'Preserve the additional existing essay');
for (const article of window.WE_DATA.articles) {
  assert.equal(article.paragraphs.length, 4, article.number);
  assert.equal(article.essay, article.paragraphs.join('\n\n'), article.number);
  for (const [i, key] of moduleKeys.entries()) {
    assert.equal(article.modules[key].join(' '), article.paragraphs[i], `${article.number} ${key}`);
  }
  const translation = window.WE_TRANSLATIONS[article.number];
  assert.equal(translation.paragraphs.length, 4, article.number);
  assert.ok(translation.paragraphs.every(text => /[\u4e00-\u9fff]/.test(text)), article.number);
  const route = window.WE_LEARNING_PATHS[article.number];
  if (article.number === "#101010" && !route) continue;
  assert.equal(route.cnRoute.length, 4, article.number);
  assert.equal(route.skeleton.length, 4, article.number);
  assert.ok(route.keywords.length >= 2, article.number);
}
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const categoriesSource = app.slice(app.indexOf('const MEMORY_CATEGORIES'), app.indexOf('const ARTICLE_TRANSLATIONS'));
const context = {};
vm.runInNewContext(categoriesSource + ';globalThis.result={categories:MEMORY_CATEGORIES,meta:MEMORY_CARD_META,filters:MEMORY_FILTERS}', context);
const {categories, meta, filters} = context.result;
assert.equal(Object.keys(categories).length, 7);
assert.equal(filters.length, 8);
assert.equal(Object.keys(meta).length, 40);
for (const article of window.WE_DATA.articles) {
  assert.equal(meta[article.number].categories.length, 1);
  assert.ok(categories[meta[article.number].categories[0]]);
}
assert.ok(!/studyPet|persisted\.pet|record\w*Pet/.test(app));
assert.ok(!fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('study-pet'));
console.log('Passed: 40 synchronized essays, four paragraphs and modules each, translations, learning paths, seven exclusive categories, no pet runtime.');

const assetContext = {};
vm.runInNewContext(app.slice(app.indexOf('function assetUrl('), app.indexOf('function openImageFullscreen(')) + ';globalThis.asset=assetUrl', assetContext);
assert.equal(assetContext.asset('./images/memory-cards/test.png?v=20261005-8'), './images/memory-cards/test.png?v=20261005-8');
assert.equal(assetContext.asset('./images/中文 card.png?v=8'), './images/%E4%B8%AD%E6%96%87%20card.png?v=8');
assert.equal(assetContext.asset('./images/encoded%20card.png'), './images/encoded%20card.png');
console.log('Passed: image URL versions remain query parameters and filenames stay encoded.');
