#!/usr/bin/env bash

dessert=pancakes
echo "Dessert is $dessert"
echo "Initial dessert: $dessert">log.txt # start new file
dessert=waffles
echo "Updated dessert: $dessert">>log.txt # append
echo 'desert is tasty!'>>log.txt # append
echo "Dessert is now $dessert"