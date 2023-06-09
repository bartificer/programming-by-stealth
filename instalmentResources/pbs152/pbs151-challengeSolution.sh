#!/usr/bin/env bash

# process args
min=1
max=10
usage="Usage: $(basename $0) [-m MIN] [-M MAX] N"
while getopts ':m:M:' opt
do
    case $opt in
        m)  
            if echo "$OPTARG" | egrep -q '^-?[0-9]+$' <<<
            then
                min=$OPTARG
            else
                echo "invalid minimum value '$OPTARG'" >&2
                exit 2
            fi
            ;;
        M)
            if echo "$OPTARG" | egrep -q '^-?[0-9]+$'
            then
                max=$OPTARG
            else
                echo "invalid maximum value '$OPTARG'" >&2
                exit 2
            fi
            ;;
        ?)
            echo "$usage" >&2
            exit 1
            ;;
    esac
done
shift $(echo "$OPTIND-1" | bc)
n=$1
if [[ -z $n ]]
then
    echo "$usage" >&2
    exit 1
fi
if ! echo "$n" | egrep -q '^-?[0-9]+$'
then
    echo "invalid number '$n' first argument must be a whole number" >&2
    exit 2
fi

echo "$n times tables from $min to $max"