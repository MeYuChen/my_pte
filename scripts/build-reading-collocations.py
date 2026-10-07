#!/usr/bin/env python3
"""Build the browser collocation catalogue from the audited workbook PDF."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

CATEGORIES = {"固定表达 / 惯用语", "结构搭配", "短语动词", "常用词块"}
START_MARKER = "第四部分 · 搭配与词块背诵表"


def extract(pdf_path: Path) -> list[dict[str, str]]:
    text = subprocess.check_output(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        text=True,
    )
    if START_MARKER not in text:
        raise ValueError(f"Cannot find {START_MARKER!r} in {pdf_path}")

    section = text[text.index(START_MARKER):]
    category = "未分类"
    entries: list[dict[str, str]] = []
    seen: set[str] = set()

    for raw_line in section.splitlines():
        stripped = raw_line.strip().replace("\f", "")
        if stripped in CATEGORIES:
            category = stripped
            continue

        match = re.match(r"^\s*([^\s].*?)\s{2,}([^\s].*[\u4e00-\u9fff].*)$", raw_line)
        if not match:
            continue
        phrase, meaning = (part.strip() for part in match.groups())
        if phrase in {"短语 / 结构", "PTE FIB 全库方法练习册"}:
            continue
        if "左侧短语" in phrase or not re.search(r"[A-Za-z]", phrase) or len(phrase) > 80:
            continue

        key = phrase.casefold()
        if key in seen:
            continue
        seen.add(key)
        meaning = meaning.replace("on���名词", "on后接名词")
        meaning = re.sub(r"\ufffd+", "", meaning)
        entries.append({
            "id": f"K{len(entries) + 1:03d}",
            "phrase": phrase,
            "meaning": meaning,
            "category": category,
        })

    return entries


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "reading-collocations.js",
    )
    args = parser.parse_args()

    entries = extract(args.pdf)
    payload = {
        "version": "2026-10-07",
        "source": args.pdf.name,
        "count": len(entries),
        "items": entries,
    }
    body = "window.READING_COLLOCATIONS = " + json.dumps(
        payload, ensure_ascii=False, indent=2
    ) + ";\n"
    args.output.write_text(body, encoding="utf-8")
    print(f"Wrote {len(entries)} collocations to {args.output}")


if __name__ == "__main__":
    main()
