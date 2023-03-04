#!/usr/bin/env bash

# use the first arg as the first guess at the name
name=$1

# keep asking for a valid name until we get one
until echo "$name" | egrep -q '^[[:alpha:]]+$'
do
    read -p "What's your name? " name
done

# print a greeting
echo "Well hello there $name 🙂"