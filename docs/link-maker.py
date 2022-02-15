#! /usr/bin/env python

import re
import sys

episode_list = []
try:
    with open("index.md", 'r') as index_file:
        for line in index_file:
            if line.startswith("* [PBS"):
                episode_list.append(line)
except FileNotFoundError:
    print("Error - File not found: 'index.md'\n")
    sys.exit()

pattern = re.compile(r"""
    \*\s\[PBS\s  # match '* [PBS '
    (\d{1,3})    # save 1-3 digits
    \s\S\s       # ' - '
    (.+)         # save the title
    \]\(         # ']('
""", re.VERBOSE)

titles = {}
for episode in episode_list:
    nbr, name = pattern.search(episode).groups()
    titles[int(nbr)] = name

# Write Markdown links to the files
# NB: Logic problem:
# If I use 'a' (append), I don't need try/except blocks
# as append creates the file if it doesn't exist.

edited_files = 0
not_found_files = 0
index = " - [Index](\)"

# Deal with edge cases. First has no previous, last has no next.
try:
    with open("pbs1.md", 'a') as file:
        next_link = f" - [PBS 2 — {titles[2]} →](pbs2)"
        addition = "\n".join(["", index, next_link, ""])
        file.write(addition)
        edited_files += 1
except FileNotFoundError:
    not_found_files += 1

try:
    with open(f"pbs{len(titles)}.md", 'a') as file:
        prev_link = (
            f" - [← PBS {len(titles) - 1} — "
            f"{titles[len(titles) - 1]}](pbs{len(titles) - 1})"
        )
        addition = "\n".join(["", prev_link, index, ""])
        file.write(addition)
        edited_files += 1
except FileNotFoundError:
    not_found_files += 1

# Write links to the rest of the files
for i in range(2, len(titles)):
    try:
        with open(f"pbs{i}.md", 'a') as file:
            prev_link = f" - [← PBS {i-1} — {titles[i-1]}](pbs{i-1})"
            next_link = f" - [PBS {i+1} — {titles[i+1]} →](pbs{i+1})"
            addition = "\n".join(["", prev_link, index, next_link, ""])
            file.write(addition)
            edited_files += 1
    except FileNotFoundError:
        not_found_files += 1

print(f"Edited {edited_files} files")
print(f"{not_found_files} files not found")