#!/bin/bash

# Create a file with contributors

# create a markdown file
echo '# Contributors\n\n' > contributors.md
git shortlog -s | cut -f2-  | awk '{print $0,"\n"}' >> contributors.md

# now make a JSON
# poor man's way


# find the number of lines
last=$(git shortlog -s | wc -l)

# set the counter
i=0

# add the opening bracket
echo '[' > contributors.json

git shortlog -s | cut -f2- | while read l  ; do
    i=$((i + 1))
    echo -n '{ "name": "'${l}'"' >> contributors.json
    if [[ $i -ne $last ]]; then
        # if it's not the last line, add the comma + newline
        echo ' },' >> contributors.json
    fi
done
# add the closing bracket and an extra newline
# because there is none after the last name
echo ' }' >> contributors.json

# add the final closing bracket for the array
echo ']' >> contributors.json
