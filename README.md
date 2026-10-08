# my_pte

用于提高 PTE WE 练习效率的离线网页工具。

## 使用

直接打开：

```text
index.html
```

或者启动本地静态服务器：

```bash
python3 -m http.server 8765
```

然后访问：

```text
http://127.0.0.1:8765/
```

## 内容

- 模板 5 分钟默写
- 移动端刷卡：中文路线、英文关键词、4 句骨架、混合提取
- 分层背诵：中文路线、中文钩子、英文关键词、4 句英文骨架
- 文章论点练习
- 单篇考核
- 综合考核
- 最近 5 次滑动窗口熟练度统计
- Reading：12 门课程组织 44 个细分考点，按“形 → 搭 → 逻 → 义”学习
- Reading：考场识别训练、完整句子例子、54 道代表题（295 空）和 22 道低频变式题
- Reading 单题计时、按空判分、答案理由及错误考点回溯

Reading 当前内置的是代表题和变式训练集，不是完整 Reading 全题库；`primary_count` 等数字是全库审计频次。

## 自动化测试

安装依赖：

```bash
npm install
```

运行 Playwright 验收测试：

```bash
npm test
```

测试会使用本机 Chrome，默认路径是 `/usr/bin/google-chrome`。如果 Chrome 路径不同，可以设置：

```bash
PLAYWRIGHT_CHROME_EXECUTABLE=/path/to/chrome npm test
```

## 更新记录

见 [CHANGELOG.md](./CHANGELOG.md)。

## AI 接手说明

见 [AI_HANDOFF.md](./AI_HANDOFF.md)。
