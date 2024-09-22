from PIL import ImageFont
import requests
import base64


def estimate_text_width(text, font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    text_width = font.getlength(text)
    return text_width


def encode_image_from_url(image_url):
    headers = {
        "Accept-Encoding": "gzip, deflate, sdch",
        "Accept-Language": "en-US,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
    }

    response = requests.get(image_url, headers=headers, stream=True)
    if response.status_code != 200:
        raise Exception(
            f"Failed to download image from {image_url}\nStatus code: {response.status_code}"
        )

    response.raw.decode_content = True
    return base64.b64encode(response.content).decode("utf-8")
