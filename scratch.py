from PIL import Image, ImageDraw, ImageFont
import os

img = Image.new('RGB', (1000, 1000), color = 'white')
width, height = img.size
cropped = img.crop((0, 0, width, int(height * 0.40)))

text_height = 160
new_img = Image.new("RGB", (width, cropped.height + text_height), "#0D1117") # Github dark
new_img.paste(cropped, (0, 0))

draw = ImageDraw.Draw(new_img)
try:
    font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
    font_normal = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
except Exception as e:
    font_large = ImageFont.load_default()
    font_normal = ImageFont.load_default()

imei = "358902518752824"
info = {"modelo": "iPhone 14", "estado": "ROBADO", "operador": "CLARO"}

draw.text((30, cropped.height + 20), f"IMEI: {imei}", font=font_large, fill="#58a6ff")
draw.text((500, cropped.height + 20), f"Modelo: {info.get('modelo', 'N/A')}", font=font_large, fill="#c9d1d9")

draw.text((30, cropped.height + 90), f"Estado: {info.get('estado', 'N/A')}", font=font_normal, fill="#ff7b72" if info.get('estado') != 'Limpio' else "#3fb950")
if info.get('operador'):
    draw.text((500, cropped.height + 90), f"Operador: {info.get('operador')}", font=font_normal, fill="#d2a8ff")

new_img.save("test_output.png")
print("Saved test_output.png")
