#!/usr/bin/env bash

# import the function from utils.sh
source "$(dirname "$0")/utils.sh"

# print test array
testVals=(42 4.5 -1 waffles)
echo "Test Values:"
for val in "${testVals[@]}"
do
    echo "- $val"
done
echo ''

# Use the function
echo -n "Result of call WITHOUT -a (should be negative): "
if is_int "${testVals[@]}"; then echo "all ints"; else echo "NOT all ints"; fi
echo -n "Result of call WITH -a (should be positve): "
if is_int -a "${testVals[@]}"; then echo "at least one int"; else echo "NO ints"; fi