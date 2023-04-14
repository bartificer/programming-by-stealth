#!/usr/bin/env bash

# read the menu
declare -a menu
while read -r menuLine
do
    # skip comment lines
    echo "$menuLine" | egrep -q '^[ ]*#' && continue

    # skip empty lines
    echo "$menuLine" | egrep -q '^[ ]*$' && continue

    # store the menu item
    menu+=("$menuLine")
done <<<"$(cat $(dirname "$BASH_SOURCE")/menu.txt)"

# default to unlimited items, then check if there is a first argument
limit=''
if [[ -n $1 ]]
then
    # validate the argument
    if echo "$1" | egrep '^[1-9][0-9]*$'
    then
        limit=$1
    else
        echo "invalid argument '$1' - must be a whole number greater than 0"
        exit 2 # custom exit code for bad arg
    fi
fi

# create an empty array to hold the order
declare -a order

# present the menu, with a done option
if [[ -z $limit ]]
then
    echo 'Choose your breakfast (as many items as you like)'
else
    echo "Choose up to $limit breakfast items"
fi
select item in done "${menu[@]}"
do
    # skip invalid selections ($item is empty)
    [[ -z $item ]] && continue

    # exit if done
    [[ $item == done ]] && break

    # store and print the item
    order+=("$item")
    echo "Added $item to your order"

    # if we're limiting, check the limit
    if [[ -n $limit ]]
    then
        [[ ${#order[@]} -ge $limit ]] && break
    fi
done

# print the order
echo -e "\nYou ordered the following ${#order[@]} items:"
for item in "${order[@]}"
do
    echo "* $item"
done