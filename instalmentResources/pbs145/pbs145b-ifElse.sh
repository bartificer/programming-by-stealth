#!/usr/bin/env bash

# check for a bash profile
if [[ -e ~/.bash_profile ]]
then
    echo "You've customised Bash with a profile\!"
else
    echo "You haven't customised your Bash profile yet"
fi