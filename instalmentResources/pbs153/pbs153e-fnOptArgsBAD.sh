#!/usr/bin/env bash

# define a POSIX function to test if all passed values are integers
# Arguments   : 1...n, the values to test
# Flags       : 
# STDIN       : value to test (only read of no args passed)
# STDOUT      : NOTHING
# Flags:
#   -a  Return success if any tested value is an integer
# Return Codes:
#   0 - the value is an integer
#   1 - the value is not an integer
is_int () {
    # save the RE used to recognise integers
    intRE='^[-]?\d+$'

    # process the optional arguments
    anyOK=''
    while getopts ':a' opt
    do
        case $opt in
            a)
                # save the fact that any int is OK
                anyOK=1
                ;;
            ?)
                # render a sane error, then return
                echo 'Function Usage: is_int [-a] [VALUES ...]'
                return 1
                ;;
        esac
    done

    # remove the optional args from the argument list
    shift $(( OPTIND - 1 ))

    # check for remaining args and process them or STDIN as appropriate
    if [[ $# -gt 0 ]]
    then
        if [[ -n $anyOK ]]
        then
            # any matching int is success
            for val in "$@"
            do
                echo "$val" | egrep -q "$intRE" && return 0
            done
            return 1
        else
            # all must match
            for val in "$@"
            do
                echo "$val" | egrep -q "$intRE" || return 1
            done
            return 0
        fi
    else
        # process STDIN
        cat | egrep -q "$intRE" && return 0
        return 1
    fi
}

# print test array
testVals=(42 -1 4.5 waffles)
echo "Test Values:"
for val in "${testVals[@]}"
do
    echo "- $val"
done
echo ''

# trigger spooky action at a distance!
echo -n "Result of first call WITHOUT -a (should be negative): "
if is_int "${testVals[@]}"; then echo "all ints"; else echo "NOT all ints"; fi
echo -n "Result of first call WITH -a (should be positve): "
if is_int -a "${testVals[@]}"; then echo "at least one int"; else echo "NO ints"; fi
echo -n "Result of second call WITHOUT -a (should be negative): "
if is_int "${testVals[@]}"; then echo "all ints"; else echo "NOT all ints"; fi