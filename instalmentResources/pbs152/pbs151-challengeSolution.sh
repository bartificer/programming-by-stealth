#!/usr/bin/env bash

#
# === set defaults ===
#
start=1    # default to starting at 1
end=10     # default to ending at 10
doDebug='' # default to not debugging

#
# === process args ===
#

# utility variables
usage="Usage: $(basename $0) [-s START] [-e END] N"
intRE='^-?[0-9]+$'

# process optional args & flags
while getopts ':s:e:d' opt
do
    case $opt in
        s)  
            if echo "$OPTARG" | egrep -q "$intRE"
            then
                start=$OPTARG
            else
                echo "invalid starting value '$OPTARG', must be a whole number" >&2
                echo "$usage" >&2
                exit 2
            fi
            ;;
        e)
            if echo "$OPTARG" | egrep -q "$intRE"
            then
                end=$OPTARG
            else
                echo "invalid ending value '$OPTARG', must be a whole number" >&2
                echo "$usage" >&2
                exit 2
            fi
            ;;
        d)
            doDebug=1
            ;;
        ?)
            echo "$usage" >&2
            exit 1
            ;;
    esac
done
shift $(echo "$OPTIND-1" | bc)

# process positional arg
n=$1
if [[ -z $n ]] # no first real arg
then
    echo "$usage" >&2
    exit 1
fi
if ! echo "$n" | egrep -q "$intRE" # invalid first real arg
then
    echo "invalid number '$n' first argument must be a whole number" >&2
    exit 2
fi

# if debugging, print values
if [[ -n $doDebug ]]
then
    echo "DEBUG: n       = $n" >&2
    echo "DEBUG: start   = $start" >&2
    echo "DEBUG: end     = $end" >&2
fi

#
# === Build row format string ===
#

# calculate maximum lengths for each column when nicely fomatted
nLen=$(printf "%'d" $n | wc -c | xargs) # character length of the number when formatted
maxMLen=1 # maximum character length of any formatted multiplier
maxPLen=1 # maximum character length of any formatted product
for m in $(seq $start $end)
do
    # Multiplier length when nicely formatted
    mLen=$(printf "%'d" $m | wc -c | xargs)
    [[ $mLen -gt $maxMLen ]] && maxMLen=$mLen

    # Product length when nicely formatted
    pLen=$(echo "$n*$m" | bc | xargs printf "%'d" | wc -c | xargs)
    [[ $pLen -gt $maxPLen ]] && maxPLen=$pLen
done

# calculate the lenght of the middle piece of the table caps
capLen=$(echo "8+$nLen+$maxMLen+$maxPLen" | bc)

# if debugging, print the calculated numbers
if [[ -n $doDebug ]]
then
    echo "DEBUG: nLen    = $nLen" >&2
    echo "DEBUG: maxMLen = $maxMLen" >&2
    echo "DEBUG: maxPLen = $maxPLen" >&2
    echo "DEBUG: capLen  = $capLen" >&2
fi

# build the row format string, and print if debugging
fString="┃ %'"$nLen"d x %'"$maxMLen"d = %'"$maxPLen"d ┃\n"
[[ -n $doDebug ]] && echo "DEBUG: fString = $fString" >&2

# build the cap insert, and print if debugging
capMid=''; for c in $(seq 1 $capLen); do capMid+='━'; done
[[ -n $doDebug ]] && echo "DEBUG: capMid  = $capMid" >&2

#
# === print the table ===
#

# print the top cap row
printf '┏%s┓\n' $capMid

# print the table body
for m in $(seq $start $end)
do
    # calcuate the product
    p=$(echo "$n*$m" | bc)

    # print the table row
    printf "$fString" $n $m $p
done

# print the bottom cap row
printf '┗%s┛\n' $capMid 