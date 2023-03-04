#!/usr/bin/env bash

echo "Your computer has the following hosts entries:"

# read the hosts file and pipe it to standard in,
# then loop through it line-by-line
cat /etc/hosts | while read -r hostsEntry
do
    # skip empty lines
    if [[ -z $hostsEntry ]]
    then
        continue
    fi

    # skip lines that start with an octothorp
    if echo "$hostsEntry" | egrep -q '^#'
    then
        continue
    fi

    # if we got here, print the line
    echo "* $hostsEntry"
done