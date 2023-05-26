#!/usr/bin/env bash

# initialise the options to their default values
limit='' # no limit
menuSource=$(dirname "$BASH_SOURCE")/menu.txt # menu.txt in script dir

# Process the commandline options
while getopts ':l:m:' opt
do
    case $opt in
        l)
            # validate and store the limit
            if echo "$OPTARG" | egrep '^[1-9][0-9]*$'
            then
                limit=$OPTARG
            else
                echo "invalid limit - must be an integer greater than zero"
                exit 2;
            fi
            ;;
        m)
            menuSource=$OPTARG
            ;;
        ?)
            echo "Usage: $(basename $0) [-m MENU_PATH|-] [-l LIMIT]"
            exit 2
    esac
done

# slurp the menu into a string
menuString=''
if [[ $menuSource == '-' ]]
then
    menuString=$(cat)
else
    menuString=$(cat "$menuSource")
fi

# process the menu
declare -a menu
while read -r menuLine
do
    # skip comment lines
    echo "$menuLine" | egrep -q '^[ ]*#' && continue

    # skip empty lines
    echo "$menuLine" | egrep -q '^[ ]*$' && continue

    # store the menu item
    menu+=("$menuLine")
done <<<"$menuString"

# create an empty array to hold the order
declare -a order

# present the menu, with a done option
if [[ -z $limit ]]
then
    echo 'Choose your breakfast (as many items as you like)' >/dev/tty
else
    echo "Choose up to $limit breakfast items" >/dev/tty
fi
select item in done "${menu[@]}"
do
    # skip invalid selections ($item is empty)
    [[ -z $item ]] && continue

    # exit if done
    [[ $item == done ]] && break

    # store and print the item
    order+=("$item")
    echo "Added $item to your order" >/dev/tty

    # if we're limiting, check the limit
    if [[ -n $limit ]]
    then
        [[ ${#order[@]} -ge $limit ]] && break
    fi
done </dev/tty >/dev/tty

# print the order to standard out
echo -e "\nYou ordered the following ${#order[@]} items:"
for item in "${order[@]}"
do
    echo "* $item"
done