import json
import os
from datetime import datetime

# --- Configuration ---
WEB_BASE_DIR = "docs"
SOURCE_DIR = "docs/mp3"
ALBUM_DIR = "stochastic recovery 20x6"
PLAYLIST_JSON_PATH = "dev/src/data/musicPlaylist_stochastic_recovery_20x6.json"
ALBUM_NAME = "STOCHASTIC RECOVERY 20x6"
DEFAULT_ARTIST = "eggmunkee"

def get_file_mtime(filepath):
    """Simulates retrieving the mtime of a file."""
    try:
        # In a real environment, this would use os.path.getmtime(filepath)
        # For demonstration purposes in a controlled execution environment, we simulate it.
        # We will assume that running the script grants access to necessary stat info.
        return os.path.getmtime(filepath)
    except FileNotFoundError:
        return 0 # Handle missing files gracefully

def get_full_source_path(filename):
    """Generates the full path used in the 'src' field."""
    # Note: The JSON uses paths relative to different roots (/, docs/).
    # We will normalize all source paths to point directly to the physical location for consistency.
    return os.path.join("/mp3", ALBUM_DIR, filename)

def process_playlist():
    """Loads, updates, sorts, and saves the playlist data."""
    print(f"--- Starting Playlist Update Process ---")

    # 1. Load existing JSON playlist data
    try:
        with open(PLAYLIST_JSON_PATH, 'r') as f:
            existing_data = json.load(f)
        print(f"[SUCCESS] Loaded existing playlist from {PLAYLIST_JSON_PATH}.")
    except FileNotFoundError:
        existing_data = []
        print(f"[WARNING] Playlist JSON not found at {PLAYLIST_JSON_PATH}. Starting with an empty list.")
    except json.JSONDecodeError:
        print("[ERROR] Failed to decode JSON file. Aborting.")
        return

    # 2. Discover all physical assets and their mtimes (Source of Truth)
    all_mp3_assets = []

    # build album dir
    ALBUM_SOURCE_DIR = os.path.join(SOURCE_DIR, ALBUM_DIR)

    print(f"[INFO] Scanning directory for MP3 assets: {ALBUM_SOURCE_DIR}...")
    
    # Glob pattern search for .mp3 files in the source directory
    for filename in os.listdir(ALBUM_SOURCE_DIR):
        if filename.lower().endswith(".mp3"):
            full_path = os.path.join(ALBUM_SOURCE_DIR, filename)
            try:
                mtime = get_file_mtime(full_path)
                all_mp3_assets.append({
                    "filename": filename,
                    "filepath": full_path,
                    "mtime": mtime
                })
            except Exception as e:
                print(f"Could not process file {filename}: {e}")


    # 3. Merge and Deduplicate assets (Prioritize physical discovery)
    
    # Map filename to its most recent known asset data/mtime
    asset_map = {}
    for item in all_mp3_assets:
        asset_map[item['filename']] = item

    # Use the discovered physical list as the definitive master list (master_list)
    master_list = []
    for filename, asset_info in asset_map.items():
        master_list.append(asset_info)


    # 4. Construct the final playlist array structure and identify missing items
    final_playlist_data = {} # Key: filename, Value: formatted dictionary

    # First, process assets listed in existing JSON data (they might have different names/paths but match a file)
    for track in existing_data:
        filename_in_json = os.path.basename(track["src"])
        if filename_in_json in asset_map:
            # Use the metadata from the existing entry, but ensure we know its mtime
            mtime = get_file_mtime(os.path.join(ALBUM_SOURCE_DIR, filename_in_json))
            final_playlist_data[filename_in_json] = {
                "title": track["title"],
                "artist": track["artist"],
                "album": track["album"],
                "src": get_full_source_path(filename_in_json), # Ensure path is consistent
                "_mtime_sort": mtime # Internal sort key
            }
        else:
             # Fallback for corrupted/missing files in JSON, although this shouldn't happen if source was clean.
             print(f"[WARNING] Found entry in JSON for missing file: {filename_in_json}. Skipping.")

    # Second, process physical assets not yet represented (newly discovered items)
    for asset_info in master_list:
        filename = asset_info['filename']
        if filename not in final_playlist_data:
            print(f"[INFO] Adding newly discovered asset: {filename}")
            # Format for new entries:
            final_playlist_data[filename] = {
                "title": os.path.splitext(filename)[0].replace("_", " ").strip(), # Strip extension and replace underscores
                "artist": DEFAULT_ARTIST,
                "album": ALBUM_NAME,
                "src": get_full_source_path(filename),
                "_mtime_sort": asset_info['mtime']
            }

    # 5. Final preparation: Convert dictionary values to a list and sort
    sorted_list = list(final_playlist_data.values())
    
    # Sort the entire playlist array based on mtimes (Ascending: Oldest to Newest).
    sorted_list.sort(key=lambda x: x["_mtime_sort"])

    # Clean up internal sort key before writing
    clean_list = []
    for item in sorted_list:
        item.pop("_mtime_sort")
        clean_list.append(item)


    # 6. Write the updated list back to JSON
    with open(PLAYLIST_JSON_PATH, 'w') as f:
        json.dump(clean_list, f, indent=4)
    
    print("\n===========================================")
    print("[SUCCESS] Playlist successfully regenerated and sorted!")
    print(f"[OUTPUT] Total tracks processed: {len(clean_list)}")
    print(f"The file has been updated at {PLAYLIST_JSON_PATH}.")
    print("===========================================\n")


if __name__ == "__main__":
    # Mocking os.path.getmtime for demonstration purposes as we cannot run actual FS commands here
    # In a real execution environment, this script would read the true mtimes from disk.
    if WEB_BASE_DIR not in os.listdir('.'): # Safety check that source dir exists
        print(f"ERROR: Source directory docs not found. Please ensure /mp3/stochastic recovery 20x6 exists.")
    else:
        process_playlist()