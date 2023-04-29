#!/usr/bin/env bash

# start by processing the options
bang='' # assume no bang
while getopts ":b" opt
do
    case $opt in
        b)
            bang='!'
            ;;
        ?)
            echo "Usage: $(basename $0) [-b] [FILE|-]..."
            exit 2
            ;;
    esac
done
shift $(echo "$OPTIND-1" | bc)

#
# -- load the text to shout --
#
text=''

# if there are no args, read STDIN
if [[ $# = 0 ]]
then
    text+=$(cat)
fi

# loop over all args and read from files or STDIN as appropriate
for path in "$@"
do
    # determine whether to treat as file or STDIN
    if [[ $path = '-' ]]
    then
        # read from STDIN
        text+=$(cat)
    else
        # read from file
        text+=$(cat "$path")
    fi
done

# convert the text to all upper case with the tr command
shoutedText=$(echo "$text" | tr [:lower:] [:upper:])

# output the upper-cased text and its optional bang
echo "$shoutedText$bang"