#!/usr/bin/env bash

echo "You belong to the following groups:"
for group in $(groups)
do
    echo "* $group"
done