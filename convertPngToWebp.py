#!/usr/bin/env python3

import os
from PIL import Image

# ===== CONFIG =====
INPUT_DIR = "./input"        # Root folder with PNGs
OUTPUT_DIR = "./output"      # Where WebP files will go
QUALITY = 85                # WebP quality (0–100)
DELETE_ORIGINAL = False     # Set True if you want to remove PNGs after conversion
# ==================

def convert_png_to_webp(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            img = img.convert("RGBA")  # Preserve transparency
            img.save(output_path, "WEBP", quality=QUALITY)
            print(f"Converted: {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def process_directory():
    for root, dirs, files in os.walk(INPUT_DIR):
        for file in files:
            if file.lower().endswith(".png"):
                input_file = os.path.join(root, file)

                # Preserve directory structure
                relative_path = os.path.relpath(root, INPUT_DIR)
                output_dir = os.path.join(OUTPUT_DIR, relative_path)
                os.makedirs(output_dir, exist_ok=True)

                output_file = os.path.join(
                    output_dir,
                    os.path.splitext(file)[0] + ".webp"
                )

                convert_png_to_webp(input_file, output_file)

                if DELETE_ORIGINAL:
                    os.remove(input_file)
                    print(f"Deleted original: {input_file}")

if __name__ == "__main__":
    process_directory()

