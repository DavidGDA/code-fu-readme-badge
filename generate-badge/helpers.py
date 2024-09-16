from PIL import ImageFont, ImageDraw, Image
import requests
import base64

def estimate_text_width(text, font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    text_width = font.getlength(text)
    return text_width

def encode_image_from_url(image_url):
    
    headers = {
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'en-US,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Connection': 'keep-alive',
    }

    response = requests.get(image_url, headers=headers, stream=True)
    if response.status_code != 200:
        raise Exception(f"Failed to download image from {image_url}")
    
    response.raw.decode_content = True
    return base64.b64encode(response.content).decode('utf-8')