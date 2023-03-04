#!/usr/bin/env bash

select desert in pancake waffles popcorn 'enough thanks'
do
    if [[ $desert == 'enough thanks' ]]
    then
        break
    fi
    echo "have some $desert"
done