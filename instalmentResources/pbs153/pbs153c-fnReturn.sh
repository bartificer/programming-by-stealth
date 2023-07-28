#!/usr/bin/env bash

# define a POSIX function to test if a value is an integer
# Arguments   : NONE
# STDIN       : value to test
# STDOUT      : NOTHING
# Return Codes:
#   0 - the value is an integer
#   1 - the value is not an integer
is_int () {
    cat | egrep -q '^[-]?\d+$' && return 0
    return 1
}

# check some values
testVals=(42 4.5 -1 waffles)
for val in "${testVals[@]}"
do
    if echo "$val" | is_int
    then
        echo "'$val' is an integer"
    else
        echo "'$val' is NOT an integer"
    fi
done