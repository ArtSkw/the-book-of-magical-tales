from pathlib import Path

from PIL import Image


# Local maintenance utility. It expects Pillow with WebP support and is meant to
# run before release when new PNG art is added to the source archive.
ROOTS = (
    Path("public/assets/illustrations"),
    Path("public/assets/scene"),
)


def convert_png(path: Path) -> tuple[int, int]:
    target = path.with_suffix(".webp")
    quality = 88 if "assets/scene" in path.as_posix() else 84

    with Image.open(path) as image:
        image.save(target, "WEBP", quality=quality, method=6)

    return path.stat().st_size, target.stat().st_size


def main() -> None:
    total_source = 0
    total_target = 0
    count = 0

    for root in ROOTS:
        for path in sorted(root.rglob("*.png")):
            source_size, target_size = convert_png(path)
            total_source += source_size
            total_target += target_size
            count += 1
            print(f"{path} -> {path.with_suffix('.webp')} ({source_size} -> {target_size})")

    saved = total_source - total_target
    print(
        f"Converted {count} PNG files. "
        f"Source {total_source / 1024 / 1024:.1f} MB, "
        f"WebP {total_target / 1024 / 1024:.1f} MB, "
        f"saved {saved / 1024 / 1024:.1f} MB."
    )


if __name__ == "__main__":
    main()
