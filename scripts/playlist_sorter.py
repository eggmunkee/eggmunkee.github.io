import json
import os
import glob
from datetime import datetime
from typing import List, Dict, Tuple

# --- Configuration Constants ---
SOURCE_MP3_DIR = "docs/mp3/stochastic recovery 20x6"
JSON_PATTERN = "dev/src/data/musicPlaylist_*.json"
DEFAULT_ARTIST = "eggmunkee"
DEFAULT_ALBUM = "STOCHASTIC RECOVERY 20x6"

# Helper function to get file modification time (mtime)
def get_mtime(filepath: str) -> float:
    """Returns the last modified time of a file."""
    try:
        return os.path.getmtime(filepath)
    except FileNotFoundError:
        print(f"Warning: Could not find modification time for {filepath}. Using current time.")
        return datetime.now().timestamp()

def process_playlist_files():
    """
    Performs file discovery, data enrichment, and chronological sorting 
    for all playlist JSON files based on MP3 mtime.
    """
    print("--- Starting Playlist Sorting Process ---")

    # 1. Discover all physical audio assets in the Source Directory
    mp3_files = glob.glob(os.path.join(SOURCE_MP3_DIR, "*.mp3"))
    physical_assets: List[str] = [os.path.relpath(f) for f in mp3_files]

    if not physical_assets:
        print("Error: No MP3 files found in the source directory.")
        return

    print(f"Found {len(physical_assets)} physical assets in '{SOURCE_MP3_DIR}'.")

    # 2. Iterate through and process all matching JSON playlist files
    json_files = glob.glob(JSON_PATTERN)
    if not json_files:
        print(f"Error: No JSON playlist files found matching pattern {JSON_PATTERN}.")
        return

    for json_filepath in json_files:
        print("-" * 40)
        print(f"Processing file: {json_filepath}")

        try:
            with open(json_filepath, 'r') as f:
                data = json.load(f)

            if not isinstance(data, list):
                print(f"Skipping {json_filepath}: Expected a root list/array.")
                continue

            # Extract current asset paths from JSON entries
            current_json_assets = set()
            for entry in data:
                if 'src' in entry and os.path.exists(os.path.join(SOURCE_MP3_DIR, entry['src'])):
                    full_src = os.path.join(SOURCE_MP3_DIR, entry['src'])
                    current_json_assets.add(entry['src'])

            # 3. Identify missing MP3 files (Enrichment)
            missing_assets: List[str] = []
            for asset in physical_assets:
                if asset not in current_json_assets:
                    missing_assets.append(asset)

            new_entries = []
            for asset_path in missing_assets:
                # Generating new entry format based on instructions
                filename = os.path.basename(asset_path).replace(".mp3", "")
                new_entry = {
                    "title": filename, # Strip extension
                    "artist": DEFAULT_ARTIST,
                    "album": DEFAULT_ALBUM,
                    # Full relative path from the source MP3 directory root
                    "src": asset_path 
                }
                new_entries.append(new_entry)

            print(f"Discovered {len(missing_assets)} new assets to add.")
            
            # Combine existing and new entries
            combined_list = data + new_entries

            # 4. Sort the entire playlist array based on mtime (Primary sort key)
            def get_entry_mtime(entry: Dict) -> float:
                """Helper to retrieve the mtime for sorting."""
                src_path = os.path.join(SOURCE_MP3_DIR, entry['src'])
                return get_mtime(src_path)

            # Sort ascending (Oldest to Newest)
            sorted_playlist = sorted(combined_list, key=get_entry_mtime)

            # 5. Save the enriched and sorted data back to the JSON file
            with open(json_filepath, 'w') as f:
                json.dump(sorted_playlist, f, indent=4)

            print(f"Successfully processed and saved {len(sorted_playlist)} entries to {json_filepath}.")


        except Exception as e:
            print(f"An error occurred while processing {json_filepath}: {e}")

# Execute the main function
if __name__ == "__main__":
    process_playlist_files()