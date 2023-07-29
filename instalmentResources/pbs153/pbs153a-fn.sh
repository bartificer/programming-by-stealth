#!/usr/bin/env bash

# store the number of times to call the function
fnCounter=1
echo "$1" | egrep '^\d+$' -q && fnCounter=$1

# define a POSIX Hello World function
# Arguments: NONE
hellow () {
    echo 'Hello World!'
    echo '(from inside a POSIX function)'
}

# call simple greeting function the appropriate number of times
while (( fnCounter > 0 )) # NOTE the arithmetic expression
do
    # call the function
    hellow

    # decrement the counter with an arithmetic expression
    (( fnCounter-- ))

    # print an empty line unless done
    (( fnCounter > 0 )) && echo ''
done