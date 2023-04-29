#!/usr/bin/env bash

# always read STDIN into a variable
theInput=$(cat)

# convert the input to all upper case with the tr command
theOutput=$(echo "$theInput" | tr [:lower:] [:upper:])

# output the upper-cased text
echo "$theOutput"