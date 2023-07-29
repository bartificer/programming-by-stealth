#!/usr/bin/env bash

# define a POSIX function to test if all passed values are integers
# Arguments   : 1...n, the values to test
# STDIN       : value to test (only read ff no args passed)
# STDOUT      : NOTHING
# Return Codes:
#   0 - the value is an integer
#   1 - the value is not an integer
is_int () {
    # save the RE used to recognise integers
    intRE='^[-]?\d+$'

    # check for args and process them or STDIN as appropriate
    if [[ $# -gt 0 ]]
    then
        # loop over args
        for val in "$@"
        do
            # return an error if not a match
            echo "$val" | egrep -q "$intRE" || return 1
        done

        # if we got here, all were matches, so return success
        return 0
    else
        # process STDIN
        cat | egrep -q "$intRE" && return 0
        return 1
    fi
}

# check values via STDIN
testVals=(42 4.5 -1 waffles)
for val in "${testVals[@]}"
do
    echo -n "Testing '$val' via STDIN: "
    if echo "$val" | is_int
    then
        echo 'YES'
    else
        echo 'NO'
    fi
done

# check single values via args
for val in "${testVals[@]}"
do
    echo -n "Testing '$val' via Single Arg: "
    if is_int "$val"
    then
        echo 'YES'
    else
        echo 'NO'
    fi
done

# many values via args
echo -n "Testing '42' & '-1' via Args: "
if is_int 42 -1
then
    echo 'ALL integers'
else
    echo 'NOT all integers'
fi
echo -n "Testing '11' & 'waffles' via Args: "
if is_int 11 waffles
then
    echo 'ALL integers'
else
    echo 'NOT all integers'
fi