#!/usr/bin/env python3
import json
import re
import subprocess
import argparse
import tempfile
from pathlib import Path

CATEGORIES = [
    ('C01', '生命科学 · 医学 · 健康', [1, 2, 8, 11, 12, 14, 30, 50]),
    ('C02', '心理 · 行为 · 儿童成长', [15, 20, 21, 36, 39, 45, 47]),
    ('C03', '自然科学 · 环境 · 资源', [4, 6, 7, 9, 33, 37, 52]),
    ('C04', '商业 · 经济 · 管理', [5, 10, 13, 25, 26, 41, 43, 44, 46, 51]),
    ('C05', '全球化 · 社会 · 政治 · 移民', [3, 18, 19, 22, 24, 38, 42]),
    ('C06', '科技 · 媒体 · 研究', [16, 17, 23, 27, 31, 34, 49]),
    ('C07', '语言 · 写作 · 文学 · 教育', [32, 48, 53, 54]),
    ('C08', '历史 · 城市 · 建筑 · 工业', [28, 29, 35, 40]),
]

CATEGORY_BY_NUMBER = {
    number: {'category_id': category_id, 'category_name': name, 'category_order': order, 'category_position': position}
    for order, (category_id, name, numbers) in enumerate(CATEGORIES, start=1)
    for position, number in enumerate(numbers, start=1)
}


def compact(lines):
    return re.sub(r'\s+', ' ', ' '.join(x.strip() for x in lines if x.strip())).strip()


def join_chinese(lines):
    result = ''
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        separator = '' if (not result or (re.search(r'[\u3400-\u9fff]$', result) and re.match(r'^[\u3400-\u9fff]', line))) else ' '
        result += separator + line
    return result


def sentences(answer):
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+(?=[A-Z])', answer) if x.strip()]


def parse_page(page):
    lines = page.splitlines()
    nonempty = [(i, x.strip()) for i, x in enumerate(lines) if x.strip()]
    match = re.fullmatch(r'(\d{2}) / 54', nonempty[0][1]) if nonempty else None
    if not match:
        return None
    number = int(match.group(1))
    title_en = nonempty[1][1]
    title_zh = nonempty[2][1]
    meta = nonempty[3][1]
    declared = int(re.search(r'(\d+)词', meta).group(1))
    status = meta.split('/', 1)[1].strip() if '/' in meta else ''

    logic_start = next(i for i, line in enumerate(lines) if line.strip() == '01 中文主线') + 1
    blocks_start = next(i for i, line in enumerate(lines) if line.strip().startswith('02 五块串记'))
    logic = join_chinese(lines[logic_start:blocks_start])

    answer_start = next(i for i, line in enumerate(lines) if line.strip() == '03 完整提交答案')
    raw_blocks = lines[blocks_start + 1:answer_start]
    chunks = []
    current = None
    in_chinese = False
    for raw in raw_blocks:
        line = raw.strip()
        if not line:
            continue
        numbered = re.match(r'^([1-5])\s+(.+)$', line)
        if numbered:
            current = int(numbered.group(1))
            while len(chunks) < current:
                chunks.append([])
            chunks[current - 1].append(numbered.group(2))
            in_chinese = False
            continue
        if current is None:
            continue
        if re.search(r'[\u3400-\u9fff]', line):
            in_chinese = True
        elif not in_chinese:
            chunks[current - 1].append(line)
    keywords = [compact(chunk) for chunk in chunks]

    section_end = next(i for i in range(answer_start + 1, len(lines)) if lines[i].strip().startswith('04 助记图'))
    answer_section = compact(lines[answer_start + 1:section_end])
    answer_match = re.match(r'^(The lecture.*?In summary,.*?\.)', answer_section)
    if not answer_match:
        raise ValueError(f'Cannot isolate final answer for {number}')
    answer = answer_match.group(1)
    answer = re.sub(r'\s+([,.;:!?])', r'\1', answer)

    return {
        'id': f'S{number:03d}',
        'number': number,
        'code': '',
        'title_en': title_en,
        'title_zh': title_zh,
        'tags': [status],
        'status': status,
        'difficulty': status,
        'logic_type': '五块串记',
        'answer': answer,
        'word_count': declared,
        'logic': logic,
        'keywords': keywords,
        'sentences': sentences(answer),
    }


def main():
    parser = argparse.ArgumentParser(description='Build the 54-item SST browser data from the approved workbook PDF.')
    parser.add_argument('pdf', type=Path)
    parser.add_argument('--output', type=Path, default=Path('sst-data.js'))
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='sst-data-') as folder:
        text_path = Path(folder) / 'sst.txt'
        subprocess.run(['pdftotext', '-layout', str(args.pdf), str(text_path)], check=True)
        pages = text_path.read_text(encoding='utf-8').split('\f')
    items = [item for page in pages if (item := parse_page(page))]
    items.sort(key=lambda item: item['number'])
    assert len(items) == 54, len(items)
    assert [x['number'] for x in items] == list(range(1, 55))
    assert all(len(x['keywords']) == 5 and all(x['keywords']) for x in items)
    assert all(x['answer'] and x['logic'] for x in items)
    for item in items:
        item.update(CATEGORY_BY_NUMBER[item['number']])
    payload = {
        'version': '2026-10-08-categorized-54',
        'source': args.pdf.name,
        'count': 54,
        'categories': [
            {'id': category_id, 'name': name, 'count': len(numbers), 'item_numbers': numbers}
            for category_id, name, numbers in CATEGORIES
        ],
        'items': items,
    }
    args.output.write_text('window.SST_DATA = ' + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'Wrote {len(items)} items: {items[0]["title_en"]} -> {items[-1]["title_en"]}')
    for item in items:
        actual = len(item['answer'].split())
        if actual != item['word_count']:
            print(f'word count note {item["id"]}: declared {item["word_count"]}, whitespace {actual}')


if __name__ == '__main__':
    main()
