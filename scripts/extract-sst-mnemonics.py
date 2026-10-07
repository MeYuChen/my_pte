#!/usr/bin/env python3
import argparse
import re
from pathlib import Path

import fitz
from PIL import Image, ImageChops


def trim_white(image: Image.Image, padding: int = 18) -> Image.Image:
    rgb = image.convert('RGB')
    background = Image.new('RGB', rgb.size, (255, 255, 255))
    difference = ImageChops.difference(rgb, background).convert('L')
    difference = difference.point(lambda value: 255 if value > 10 else 0)
    box = difference.getbbox()
    if not box:
        return rgb
    left, top, right, bottom = box
    return rgb.crop((max(0, left - padding), max(0, top - padding), min(rgb.width, right + padding), min(rgb.height, bottom + padding)))


def main() -> None:
    parser = argparse.ArgumentParser(description='Extract the 54 SST mnemonic diagrams from the categorized workbook PDF.')
    parser.add_argument('pdf', type=Path)
    parser.add_argument('--output-dir', type=Path, default=Path('images/sst'))
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    document = fitz.open(args.pdf)
    written = []
    for page in document:
        match = re.search(r'(?m)^(\d{2}) / 54\s*$', page.get_text())
        if not match:
            continue
        number = int(match.group(1))
        markers = [word for word in page.get_text('words') if word[4] == '助记图']
        if len(markers) != 1:
            raise ValueError(f'SST {number:02d}: expected one mnemonic marker, found {len(markers)}')
        marker_bottom = markers[0][3]
        clip = fitz.Rect(34, marker_bottom + 8, page.rect.width - 34, 800)
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False)
        image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
        image = trim_white(image)
        if image.width > 1000:
            height = round(image.height * 1000 / image.width)
            image = image.resize((1000, height), Image.Resampling.LANCZOS)
        target = args.output_dir / f'S{number:03d}.webp'
        image.save(target, 'WEBP', quality=82, method=6)
        written.append((number, image.width, image.height, target.stat().st_size))

    if [number for number, *_ in sorted(written)] != list(range(1, 55)):
        raise ValueError(f'Expected SST 1-54, got {[number for number, *_ in sorted(written)]}')
    print(f'Wrote {len(written)} mnemonic images to {args.output_dir}')
    print(f'Total bytes: {sum(size for *_, size in written)}')
    print(f'Dimensions: {min(width for _, width, _, _ in written)}-{max(width for _, width, _, _ in written)} px wide; {min(height for _, _, height, _ in written)}-{max(height for _, _, height, _ in written)} px tall')


if __name__ == '__main__':
    main()
