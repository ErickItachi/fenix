# Converte os logos dos marketplaces (brand/marketplaces/) em silhuetas monocromáticas
# brancas com fundo transparente, prontas para colorir via CSS (mask) no site.
# Uso: python3 scripts/marketplaces.py brand/marketplaces public/marketplaces
#
# Cada pixel vira "tinta" na proporção em que é escuro ou saturado. Fundos brancos,
# cinza-claros (inclusive o xadrez falso do arquivo da Amazon) somem; o branco dentro
# do logo (o "S" da Shopee, o aperto de mãos do Mercado Livre) vira recorte.
import os
import sys
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

FILES = {
    'mercado-livre': 'mercado-livre.png',
    'shopee': 'shopee.webp',
    'amazon': 'amazon.png',
    'magalu': 'magalu.png',
}
HEIGHT = {'mercado-livre': 200, 'shopee': 360, 'amazon': 200, 'magalu': 140}


def ink(rgba):
    r, g, b, a = rgba
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = max(r, g, b) - min(r, g, b)
    dark = (226 - lum) / 120
    color = (sat - 40) / 90
    v = max(0.0, min(1.0, max(dark, color)))
    return int(v * a)


for name, file in FILES.items():
    im = Image.open(os.path.join(src, file)).convert('RGBA')
    alpha = Image.new('L', im.size)
    alpha.putdata([ink(p) for p in im.get_flattened_data()])
    alpha = alpha.filter(ImageFilter.MedianFilter(3))
    box = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    alpha = alpha.crop(box)
    white = Image.new('RGBA', alpha.size, (255, 255, 255, 0))
    white.putalpha(alpha)
    h = HEIGHT[name]
    w = round(white.width * h / white.height)
    white = white.resize((w, h), Image.LANCZOS)
    white.save(os.path.join(out, f'{name}.webp'), lossless=True, method=6)
    print(name, white.size)
