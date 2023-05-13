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

# initialise the options to their default values
limit='' # no limit
snark='' # no snark

# Process the commandline options
while getopts ':l:s' opt
do
    case $opt in
        l)
            # validate and store the limit
            if echo "$OPTARG" | egrep '^[1-9][0-9]*$'
            then
                limit=$OPTARG
            else
                echo "invalid limit - must be an integer greater than zero"  >&2
                exit 2;
            fi
            ;;
        s)
            snark=1
            ;;
        ?)
            echo "Usage: $(basename $0) [-s] [-l LIMIT]"  >&2
            exit 2
    esac
done

# create an empty array to hold the order
declare -a order

# present the menu, with a done option
if [[ -z $limit ]]
then
    if [[ -n $snark ]]
    then
        echo "Wha' d' ya want (greed is grand)?" >&2
    else
        echo 'Choose your breakfast (as many items as you like)' >&2
    fi
else
    if [[ -n $snark ]]
    then
        echo "Pick no more than $limit things, and make it snappy!"  >&2
    else
        echo "Choose up to $limit breakfast items"  >&2
    fi
fi
select item in done "${menu[@]}"
do
    # skip invalid selections ($item is empty)
    [[ -z $item ]] && continue

    # exit if done
    [[ $item == done ]] && break

    # store and print the item
    order+=("$item")
    if [[ -n $snark ]]
    then
        echo "Fine, you can have $item"  >&2
    else
        echo "Added $item to your order"  >&2
    fi

    # if we're limiting, check the limit
    if [[ -n $limit ]]
    then
        [[ ${#order[@]} -ge $limit ]] && break
    fi
done

# print the order
if [[ -n $snark ]]
then
    echo -e "\nYour sodding ${#order[@]} items:"
else
    echo -e "\nYou ordered the following ${#order[@]} items:"
fi
for item in "${order[@]}"
do
    echo "* $item"
done