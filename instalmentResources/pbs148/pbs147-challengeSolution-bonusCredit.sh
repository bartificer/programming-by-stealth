#!/usr/bin/env bash

# read the menu
declare -a menu
cat $(dirname "$BASH_SOURCE")/menu.txt | while read -r menuLine
do
    # skip comment lines
    echo "$menuLine" | egrep -q '^[ ]*#' && continue

    # skip empty lines
    echo "$menuLine" | egrep -q '^[ ]*$' && continue

    # store the menu item
    menu+=("$menuLine")
done

# create an empty array to hold the order
declare -a order

# present the menu, with a done option
echo 'Choose your breakfast'
select item in done "${menu[@]}"
do
    # exit if done
    [[ $item == done ]] && break

    # store and print the item
    order+=("$item")
    echo "Added $item to your order"
done

# print the order
echo -e "\nYou ordered the following ${#order[@]} items:"
for item in "${order[@]}"
do
    echo "* $item"
done