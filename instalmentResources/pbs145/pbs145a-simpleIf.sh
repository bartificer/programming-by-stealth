#!/usr/bin/env bash

# store the first arg as the name
name=$1

# test if we got a name, and if not, ask for one
if [[ -z $name ]]
then
    read -p "What's your name? " name
fi

# greet the user
echo "Well hello there $name 🙂"