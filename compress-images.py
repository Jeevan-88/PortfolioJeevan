import os
import time
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

folders = ['whoami', 'aboutme', 'projects', 'skills', 'resume', 'connect']
base_dir = os.path.join(os.path.dirname(__file__), 'public')

def compress_single_image(args):
    folder, filename = args
    src_path = os.path.join(base_dir, folder, filename)
    dest_filename = os.path.splitext(filename)[0] + '.jpg'
    dest_path = os.path.join(base_dir, folder, dest_filename)
    
    try:
        with Image.open(src_path) as img:
            # Resize 4K to 1080p (4x VRAM reduction)
            if img.size[0] > 1920:
                img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
            # Convert to RGB if needed
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (5, 8, 16)) # Dark bg matching #050810
                background.paste(img, mask=img.split()[-1])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            # Save as optimized JPEG
            img.save(dest_path, 'JPEG', quality=70, optimize=True)
            
        # Delete original PNG to free space
        os.remove(src_path)
        return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

def main():
    start_time = time.time()
    tasks = []
    
    for folder in folders:
        folder_path = os.path.join(base_dir, folder)
        if not os.path.exists(folder_path):
            continue
        for filename in os.listdir(folder_path):
            if filename.lower().endswith('.png'):
                tasks.append((folder, filename))
                
    total_tasks = len(tasks)
    print(f"Starting batch compression of {total_tasks} PNG frames...")
    
    # Process in parallel using ThreadPoolExecutor (max CPU cores utilization)
    completed = 0
    with ThreadPoolExecutor() as executor:
        for result in executor.map(compress_single_image, tasks):
            completed += 1
            if completed % 100 == 0 or completed == total_tasks:
                pct = (completed / total_tasks) * 100
                print(f"Progress: {completed}/{total_tasks} ({pct:.1f}%) completed...")
                
    elapsed = time.time() - start_time
    print(f"Batch compression completed in {elapsed:.2f} seconds!")

if __name__ == '__main__':
    main()
