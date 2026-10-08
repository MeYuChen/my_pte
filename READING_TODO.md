# Reading 后续 TODO

> 交接分支：`feature/reading-learning-flow`  
> 当前基线：`c3b5ce9 fix: separate scan order from decisive evidence`  
> 目标：完成 Reading 内容审核后，再合入 `master` 并发布。

## 已完成

- 新增 12 个学习分类（L01—L12），按“形 → 搭 → 逻 → 义”组织 44 个细分考点。
- 新增考场识别训练：固定扫描顺序始终是“形 → 搭 → 逻 → 义”，同时单独标明本空的决定性证据。
- 新增固定搭配学习卡：支持范围选择、记住后移出、未记住随机复现、全部记住后选择题测试。
- 修复固定搭配范围计数；补充简单英文例句和中文翻译。
- 澄清 `compare A to B` / `compare A with B`。
- 修正 Golden Gate Bridge 示例：`opens to the public` 的答案正确，但不得把 `appears to the public` 说成语法错误。
- 解析固定显示在文章下方；错题可进入考点详情并返回，当前关联考点可高亮。

## 必须继续完成：全量解析审核

题库代表练习共 54 题、295 空。不能只审核示例题，必须逐空核对：

1. 正确答案是否与原文、原始选项一致。
2. 主考点是否真的是该空的决定性证据；关联考点是否只是辅助证据。
3. 解析是否明确写出：
   - 先用哪一层证据筛选；
   - 为什么正确答案成立；
   - 其他选项具体错在形式、搭配、逻辑还是词义。
4. 禁止空泛套话，例如“由句法形式、搭配或全文逻辑获得有效排他证据”。
5. 禁止编造绝对规则；能在其他语境成立的结构，只能说明“本题语境不合”。
6. R 题缺少机构干扰词池时，只解释正确答案涉及的考点，不认证选项唯一性。
7. 教学语言要能直接用于两分钟考场判断，删除审核术语和无助于做题的废话。

### 已发现、待改写的过短解析

- `R285:1`、`R285:2`、`R285:5`
- `R397:6`
- `R425:1`、`R425:2`
- `R374:5`
- `R408:4`、`R408:5`
- `R380:4`
- `R215:3`、`R215:4`、`R215:5`
- `R356:3`

此前自动筛查从 295 条解析中标出 112 条含“必须、只能、固定看”等高风险措辞。此数字不是 112 条确定错误；需要逐条结合全文和候选项人工复核。已明确修正的错误是 `RW160:1` 对 `appears to` 的错误绝对化判断。

## 建议的验收门槛

- 295/295 个空均有可教学的题内解析。
- 0 条通用套话。
- 0 条无条件的虚假语法/搭配规则。
- 每空可从解析追溯到 L01—L12 之一及对应细分考点。
- 12 个分类、44 个细分考点、54 题、295 空之间映射完整。
- 固定搭配卡的短语、释义、例句、中文翻译一致。
- 手机端完成：选答案 → 提交 → 查看文章下方解析 → 打开考点 → 返回原题。
- 全部自动化测试通过。

## 验证命令

```bash
node tests/reading-module.cjs
npx playwright test tests/reading.spec.js
npm test
```

检查提交差异：

```bash
git diff master...feature/reading-learning-flow
git log --oneline master..feature/reading-learning-flow
```

## 合并与发布

全量审核及测试通过后：

```bash
git checkout master
git pull --ff-only origin master
git merge --no-ff feature/reading-learning-flow
git push origin master
```

合并前应更新 `CHANGELOG.md`，并再次提升 `sw.js` 缓存版本，防止 GitHub Pages 继续读取旧 Reading 静态资源。
