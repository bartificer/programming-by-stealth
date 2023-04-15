#!/usr/bin/env bash

# store the passed args in an array named $args (could be any name)
args=("$@")

# demo array
echo "The array \$args contains ${#args[@]} items:"
for a in "${args[@]}"
do
    echo "* $a"
done