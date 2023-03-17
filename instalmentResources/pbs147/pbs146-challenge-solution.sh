#!/usr/bin/env bash

# deal with the number to multiply
# start with the value of the first arg, if any
num="$1"

# make sure we have a valid value
until echo "$num" | egrep -q '^[1-9][0-9]*$'
do
    read -p 'Enter a positive whole number: ' num
done

# figure out how high to count to
max=10
if [[ ! -z "$2" ]] # if there is a second arg, validate it
then
    if echo "$2" | egrep -q '^[1-9][0-9]*$'
    then
        max=$2
    else
        echo 'invalid maximum value - must be a positive integer'
        exit 1
    fi
fi

# loop through the table
for n in $(seq $max)
do
    # do the math
    prod=$(echo "$n*$num" | bc)

    # print the line
    echo "$num x $n = $prod"
done