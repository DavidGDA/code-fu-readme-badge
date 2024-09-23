import svgwrite
from helpers import estimate_text_width, encode_image_from_url

def generate_badge_svg(persona):
    # Configuraciones
    """
    Genera un SVG de una badge con la información
    de un miembro.

    Args:
        persona (dict): Diccionario con información del miembro,
            contiene las keys "codigo", "nombre", "cargo" e "imagen"

    Returns:
        None
    """
    width = 220
    height = 110
    logo_url = "https://code-fu.net.ni/wp-content/uploads/2024/07/Code-FU-Landscape.svg"
    name_size = 13
    cargo_size = 9
    max_text_width = 110
    font = "font/Montserrat-Bold.ttf"

    # Descargar y decodificar imágenes
    image_base64 = encode_image_from_url(persona["imagen"])
    logo_base64 = encode_image_from_url(logo_url)

    dwg = svgwrite.Drawing(f"../public/badges/{persona['codigo']}.svg", size=(f"{width}px", f"{height}px"))

    # Añadir fuente
    dwg.defs.add(dwg.style("""
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        text { font-family: 'Montserrat', sans-serif; font-weight: bold;}
    """))
    # Crear un rectángulo de fondo
    dwg.add(dwg.rect(insert=(0, 0), size=(width, height), fill="white"))
    dwg.add(dwg.rect(insert=(0, 0), size=(120, 30), fill="#A51C30"))
    dwg.add(dwg.rect(insert=(120, 0), size=(100, 110), fill="#A1A1A1"))

    # Añadir una máscara circular para la imagen
    mask_id = "circular_mask"
    mask = dwg.defs.add(dwg.mask(id=mask_id))
    mask.add(dwg.circle(center=(170, 55), r=45, fill="white"))

    # Añadir la imagen desde la URL y aplicar la máscara circular
    dwg.add(dwg.image(href=f"data:image/webp;base64,{image_base64}", insert=(125, 10), size=("90px", "90px"), mask=f"url(#{mask_id})"))

    # Añadir el nombre
    while (estimate_text_width(persona["nombre"], font, name_size) > max_text_width):
        name_size -= 0.5
        if (name_size <= 0):
            raise Exception("Text is too large to fit")

    dwg.add(dwg.text(persona["nombre"], insert=(60, 16), font_size=f"{name_size:.2f}px", fill="white",
                     text_anchor="middle", dominant_baseline="middle"))

    # Añadir el cargo (40% area)
    while (estimate_text_width(persona["cargo"], font, cargo_size) > max_text_width):
        cargo_size -= 0.5
        if (cargo_size <= 0):
            raise Exception("Text is too large to fit")


    dwg.add(dwg.text(persona["cargo"], insert=(60, 41), font_size=f"{cargo_size:.2f}px", fill="black",
                     text_anchor="middle", dominant_baseline="middle"))
    
    # Añadir badge (60% area)
    dwg.add(dwg.image(href=f"data:image/svg+xml;base64,{logo_base64}", insert=(15, 50), size=("90px", "60px")))

    dwg.save()
