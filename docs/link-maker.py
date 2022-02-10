#! /usr/bin/env python

import re

episode_list = []
with open("index.md", 'r') as index_file:
    for line in index_file:
        if line.startswith("* [PBS"):
            episode_list.append(line)

pattern = re.compile(r'''
    \*\s\[PBS\s  # match '* [PBS '
    (\d{1,3})    # save 1-3 digits
    \s\S\s       # ' - '
    (.+)         # save the title
    \]\(         # ']('
''', re.VERBOSE)

titles = []
for episode in episode_list:
    titles.append(pattern.search(episode).groups())

print(len(titles))