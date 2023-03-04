#!/usr/bin/env bash

echo "The following Hex characters are valid:"
for char in {0..9} {a..f}
do
    echo "* $char"
done