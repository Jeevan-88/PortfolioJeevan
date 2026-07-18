import os
import re
import shutil
import json
from PIL import Image

src_dir = r"E:\whoami"
dest_dir = r"E:\MyPortfolio\public\whoami-frames"
index_path = r"E:\MyPortfolio\public\frames-index.json"

if not os.path.exists(src_dir):
    print(f"Source directory does not exist: {src_dir}")
    exit(1)

# Ensure clean destination directory
if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)
os.makedirs(dest_dir, exist_ok=True)

# List all files and sort numerically
files = [f for f in os.listdir(src_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

def get_num(name):
    nums = re.findall(r'\d+', name)
    return int(nums[0]) if nums else 0

files.sort(key=get_num)

print(f"Found {len(files)} source files in {src_dir}")

FACTOR = 3
count = 0
retained_names = []

for i, filename in enumerate(files):
    if i % FACTOR == 0 or i == len(files) - 1:
        if i == len(files) - 1 and i % FACTOR == 0:
            continue
        src_path = os.path.join(src_dir, filename)
        dest_filename = f"PortfolioAnimation_{count:03d}.jpg"
        dest_path = os.path.join(dest_dir, dest_filename)
        
        try:
            with Image.open(src_path) as img:
                # Resize to 1920x1080
                img_resized = img.resize((1920, 1080), Image.Resampling.LANCZOS)
                # Save as JPEG with quality 80
                img_resized.save(dest_path, "JPEG", quality=80)
            retained_names.append(dest_filename)
            count += 1
            if count % 20 == 0:
                print(f"Processed {count} frames...")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Update frames-index.json
if os.path.exists(index_path):
    with open(index_path, 'r') as f:
        index_data = json.load(f)
    index_data["whoami"] = retained_names
    with open(index_path, 'w') as f:
        json.dump(index_data, f, indent=2)
    print(f"Updated index at {index_path} with {len(retained_names)} frames.")

print(f"Successfully processed {count} frames into {dest_dir}!")
