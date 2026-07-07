import os
from PIL import Image, ImageDraw, ImageFont

def create_placeholder(filepath, text):
    # Create a 800x600 image with a sports-themed background color (Royal Blue)
    img = Image.new('RGB', (800, 600), color=(65, 105, 225))
    draw = ImageDraw.Draw(img)

    # Try to use a default font
    try:
        font = ImageFont.load_default()
    except:
        font = None

    # Draw text in the center
    draw.text((400, 300), text, fill=(255, 215, 0), anchor="mm")

    img.save(filepath)
    print(f"Created placeholder: {filepath}")

def main():
    os.makedirs("Assets/Images", exist_ok=True)
    os.makedirs("Assets/Videos", exist_ok=True)

    placeholders = {
        "Assets/Images/neeraj_chopra.jpg": "NEERAJ CHOPRA - JAVELIN GOLD",
        "Assets/Images/fifa_trophy.jpg": "FIFA WORLD CUP TROPHY",
        "Assets/Images/olympic_rings.jpg": "THE OLYMPIC RINGS",
        "Assets/Images/lusail_stadium.jpg": "LUSAIL STADIUM - QATAR",
        "Assets/Images/pv_sindhu.jpg": "P.V. SINDHU - BADMINTON",
        "Assets/Images/school_logo.jpg": "SCHOOL LOGO HERE",
        "Assets/Images/trophy_icon.jpg": "TROPHY ICON"
    }

    for path, text in placeholders.items():
        create_placeholder(path, text)

    # For videos, since we can't easily generate valid MP4s without external tools like moviepy
    # and they aren't strictly required to be 'valid' for a PPTX (they are just embedded),
    # I will keep the descriptive text files but maybe rename them to .txt for clarity if allowed,
    # OR better, since the script expects .mp4, I'll keep them as is but documented.
    # Actually, let's keep them as .mp4 placeholders as before but they will be handled by PPTX.
    # PPTX might complain if they are not real MP4s during playback, but at least the presentation opens.

if __name__ == "__main__":
    main()
