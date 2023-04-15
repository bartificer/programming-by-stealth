#!/usr/bin/env bash

beSnarky='' # assume -s is not passed
adjective='brilliant' # default adjective for the person

# store the usage string
usage="Usage: $(basename $0) [-s] [-a ADJECTIVE] NAME"

# accpet a flag named s to request snark, and an optional
# adjective a to describe the user
# save the name of the matched option in $opt (our choice of name)
while getopts ':sa:' opt
do
    case $opt in
        s)
            # enable snark!
            echo 'DEBUG enabling snark'
            beSnarky=1
            ;;
        a)
            # store the the adjective
            echo "DEBUG saving custom adjective '$OPTARG'"
            adjective="$OPTARG"
            ;;
        ?)
            # render a sane error, then exit
            echo "$usage"
            exit 1
            ;;
    esac
done

# remove the options from the args
shift $(echo "$OPTIND-1" | bc)

# process the remaining args, requiring a name as the first one
name=$1
if [[ -z $name ]]
then
    echo "$usage"
    exit 1
fi

# assemble the greeting, then print it
greeting=''
if [[ -n $beSnarky ]]
then
    greeting+="Oi"
else
    greeting+="Hi"
fi
greeting+=" $adjective $name"'!'
echo "$greeting"
