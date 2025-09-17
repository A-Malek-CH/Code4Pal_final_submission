import os
import shutil

def flatten_folder(root_dir, target_dir):
    """
    Copies all files from nested folders into a single folder.

    Args:
        root_dir (str): The directory to flatten.
        target_dir (str): Where to copy all files.
    """
    os.makedirs(target_dir, exist_ok=True)

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            src = os.path.join(dirpath, filename)
            dst = os.path.join(target_dir, filename)

            # Handle duplicate filenames
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(dst):
                dst = os.path.join(target_dir, f"{base}_{counter}{ext}")
                counter += 1

            shutil.copy2(src, dst)  # copy instead of move

if __name__ == "__main__":
    flatten_folder("./components/layout", "./flattened_folder-layout")
