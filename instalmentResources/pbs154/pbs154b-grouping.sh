#!/usr/bin/env bash

dessert=pancakes
echo "Dessert is $dessert"

# grouped commands
{
    echo "Initial dessert: $dessert" # no need to redirect!
    dessert=waffles
    echo "Updated dessert: $dessert" # no need to redirect!
    echo 'desert is tasty!' # no need to redirect!
}>log.txt # start new file

echo "Dessert is now $dessert"