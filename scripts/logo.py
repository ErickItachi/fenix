# Gera os derivados web do logo a partir do original transparente em brand/.
# Uso: python3 scripts/logo.py brand/fenix-logo-original.webp public/brand
import os
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
alpha = im.getchannel('A').point(lambda v: 255 if v > 24 else 0)
logo = im.crop(alpha.getbbox())
os.makedirs(out, exist_ok=True)
for w in (320, 640, 1280):
    h = round(logo.height * w / logo.width)
    logo.resize((w, h), Image.LANCZOS).save(f'{out}/fenix-logo-{w}.webp', quality=90, method=6)
print('logo', logo.size)
