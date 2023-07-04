#!/usr/bin/env bash

# convert the arguments to a true array
# note: pre-fixing with empty string to make 1-indexed
argsArray=( '' "$@" )

# loop over the indexes of the arguments
for i in $(seq 1 $#)
do
    echo "\$$i->|"${argsArray[$i]}"|<-\$$i"
done