from PIL import ImageFont
import requests
import base64

def estimate_text_width(text, font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    text_width = font.getlength(text)
    return text_width

def encode_image_from_url(image_url):
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
        'Accept': 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
    }

    response = requests.get(image_url, headers=headers)
    print(response.text)

    if response.status_code != 200:
        raise Exception(f"Failed to download image from {image_url}")
    
    response.raw.decode_content = True
    return base64.b64encode(response.content).decode('utf-8')