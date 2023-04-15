#!/usr/bin/env bash

beSnarky='' # assume -s is not passed
worldAdjective='wonderful' # default adjective for the world

# accept a flag named s to request snark, and an optional
# adjective w to describe the world
# save the name of the matched option in $opt (our choice of name)
while getopts ':sw:' opt
do
    case $opt in
        s)
            # enable snark!
            echo 'DEBUG enabling snark'
            beSnarky=1
            ;;
        w)
            # store the the adjective
            echo "DEBUG saving custom adjective '$OPTARG'"
            worldAdjective="$OPTARG"
            ;;
        ?)
            # render a sane error, then exit
            echo "Usage: $(basename $0) [-s] [-w ADJECTIVE]"
            exit 1
            ;;
    esac
done

# assemble the greeting, then print it
greeting=''
if [[ -n $beSnarky ]]
then
    greeting+="Oi you"
else
    greeting+="Hello"
fi
greeting+=" $worldAdjective world"'!'
echo "$greeting"
