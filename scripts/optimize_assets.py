from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = ROOT / "Assets"


def save_webp(source: Path, target: Path, crop=None, quality=86):
    with Image.open(source) as image:
        image.load()
        if crop:
            image = image.crop(crop)
        image.save(target, "WEBP", quality=quality, method=6)


save_webp(ASSETS / "che-qiim-source.png", PUBLIC / "che-qiim.webp", quality=88)
save_webp(
    ASSETS / "02-isu-tempat-kerja.png",
    PUBLIC / "office-scene.webp",
    crop=(0, 580, 920, 941),
    quality=84,
)
save_webp(
    ASSETS / "03-pendekatan-seminar.png",
    PUBLIC / "checklist-scene.webp",
    crop=(0, 270, 842, 888),
    quality=86,
)

with Image.open(ASSETS / "01-pembukaan.png") as image:
    image = image.convert("RGB")
    image.thumbnail((1200, 675), Image.Resampling.LANCZOS)
    image.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)

with Image.open(ASSETS / "che-qiim-source.png") as image:
    face = image.crop((250, 0, 836, 586)).resize((96, 96), Image.Resampling.LANCZOS)
    face.save(PUBLIC / "favicon.png", "PNG", optimize=True)

for path in sorted(PUBLIC.glob("*")):
    if path.is_file():
        print(f"{path.name}: {path.stat().st_size:,} bytes")
