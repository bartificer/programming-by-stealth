#!/usr/bin/env bash

# define the menu
menu=(pancakes waffles porridge sausages bacon eggs spam tea coffee 'orange juice')

# create an empty array to hold the order
declare -a order

# present the menu, with a done option
echo 'Choose your breakfast'
select item in done "${menu[@]}"
do
    # skip invalid selections ($item is empty)
    [[ -z $item ]] && continue

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