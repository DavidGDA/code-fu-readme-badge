from PIL import ImageFont
import requests
import base64


def estimate_text_width(text, font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    text_width = font.getlength(text)
    return text_width


def encode_image_from_url(image_url):
    headers = {
        "Cookie": "humans_21909=1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    }

    response = requests.get(image_url, headers=headers, stream=True)
    if response.status_code != 200:
        raise Exception(
            f"Failed to download image from {image_url}"
            f"Status code: {response.status_code}"
            f"Reason: {response.text}"
        )

    response.raw.decode_content = True
    return base64.b64encode(response.content).decode("utf-8")
