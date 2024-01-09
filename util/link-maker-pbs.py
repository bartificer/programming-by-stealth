#! /usr/bin/env python3

# link-maker creates previous and next links at the bottom
# of every PBS file
#
# Based on a script of Mark G <deafiant>
# Extended by Helma to check for existing links
#
# This script makes a list of all the episodes in the index.md
# file, generates a set of links and appends them to the end of the episode files.
#
# When the last line of a file is equal to the 'next' line, the file is skipped
# so reruns of the script will not keep adding links.
#
# On each run the script checks for the existence of the links, if they are there
# they are removed and readded. This handles the following cases:
#
# - if a file that was the last file on a previous run, but it is not the last one
#   any more, it will get the full set of links
#
# - if episode titles are changed, all links will be updated accordingly
#
# Caveats/Todos:
# This script only works on file that start with 'pbs', i.e. the tidbit files are skipped.
# Use the other script for the tidbit files.
#

import re
import sys
import subprocess

edited_files = 0
not_found_files = 0
index = " - [Index](index)"

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

# little helper function to find out
# if a string is empty or contains only spaces
def isEmpty(s):
    empty = (not s or not s.strip())
    return empty

# Check if the links are already there if so, remove them
#
# This function assumes that the links are always at the bottom of the file
# with one empty line before the links
#
# param pbs_file: file to process
# param lines_before: how many lines before the index line
#                     should be removed as well

def remove_links(pbs_file, lines_before):
    sp_output = subprocess.run(
        ['grep', '-nF', '[Index](index)', pbs_file],
        stdout=subprocess.PIPE, 
        text=True)
    
    # index_line is the line where the [Index](index) link is found
    if sp_output.returncode != 0:
        # line is not found, skip the rest
        return 

    # get the first of the lines, only the part before the colon
    # and turn it into an integer
    index_line = int(sp_output.stdout.splitlines()[0].split(':')[0])
        
    with open(pbs_file, "r") as f:
        lines = f.readlines()

    length = len(lines)

    # index starts at 0 so remove an extra one
    first_to_remove = index_line - lines_before - 1

    if first_to_remove >= length:
        # nothing to do here
        return
    
    with open(pbs_file, "w") as f:
        for i, line in enumerate(lines):
            # we're only interested in the last lines
            # starting at 'first_to_remove
            # so write the previous ones and move on
            if i < first_to_remove:
                f.write(line)

titles = {}
for episode in episode_list:
    nbr, name = pattern.search(episode).groups()
    titles[int(nbr)] = name

# Write Markdown links to the files
# NB: Logic problem:
# If I use 'a' (append), I don't need try/except blocks
# as append creates the file if it doesn't exist.


# Deal with edge cases. First has no previous, last has no next.
#
# Deal with the first file
try:
    remove_links("pbs1.md", 1)

    with open("pbs1.md", 'a') as file:
        next_link = f" - [PBS 2 — {titles[2]} →](pbs2)"
        addition = "\n".join(["", index, next_link, ""])
        file.write(addition)
        edited_files += 1
except FileNotFoundError:
    not_found_files += 1

# Deal with the last file
try:
    remove_links(f"pbs{len(titles)}.md", 2)
   
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
        remove_links(f"pbs{i}.md", 2)

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
