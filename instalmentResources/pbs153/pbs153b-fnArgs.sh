#!/usr/bin/env bash

# define a POSIX Hello World fuction
# Arguments: NONE
hellow () {
    echo 'Hello World!'
    echo '(from inside a POSIX function)'
}

# call simple greeting function
hellow

# define a function to greet a user
# Arguments:
# 1. the user's name, default to the $USER environment var
hellou () {
    # save the name from first arg, use $USER if no arg passed
    name="$1"; [[ -n $name ]] || name="$USER"

    # Print the greeting
    echo "Hello $name"'!'
}

# call the greeting function without and then with a names
hellou
hellou Bob

# define a function that uses getopts to optionally greet a user with a desert
# Arguments:
# 1. the user's name, default to the $USER environment var
# Optional Args:
# d - a desert the user likes
hellod () {
    # process the optional arguments
    while getopts ':d:' opt
    do
        case $opt in
            d)
                # save the desert
                desert="$OPTARG"
                ;;
            ?)
                # render a sane error, then exit
                echo 'Function Usage: hellod [-d DESERT]'
                exit 1
                ;;
        esac
    done

    # save the name from first positional arg, use $USER if no arg passed
    shift $(( OPTIND - 1 ))
    name="$1"; [[ -n $name ]] || name="$USER"

    # Print the greeting
    echo "Hello $name"'!'

    # if passed, print the desert
    if [[ -n $desert ]]
    then
        echo "I hear you like $desert, I agree 🙂"
    fi
}

# call the desert greeting with various combinations of arg and opt args
hellod
hellod Bob
hellod -d waffles Bob